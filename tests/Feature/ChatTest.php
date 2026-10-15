<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class ChatTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Cache::flush();
        RateLimiter::clear('chat');
        config([
            'services.anthropic.enabled' => true,
            'services.anthropic.key' => 'test-anthropic-key',
            'services.anthropic.model' => 'claude-haiku-5-5',
            'services.anthropic.daily_cap' => 150,
            'services.turnstile.site_key' => '',
            'services.turnstile.secret_key' => '',
        ]);
    }

    public function test_chat_returns_reply_and_signature_successfully(): void
    {
        Http::fake([
            'https://api.anthropic.com/v1/messages' => Http::response([
                'id' => 'msg_123',
                'type' => 'message',
                'role' => 'assistant',
                'content' => [
                    [
                        'type' => 'text',
                        'text' => 'BindToClose ensures server data is saved before shutdown.',
                    ],
                ],
                'stop_reason' => 'end_turn',
            ], 200),
        ]);

        $response = $this->postJson('/api/chat', [
            'messages' => [
                [
                    'role' => 'user',
                    'content' => 'How do I handle BindToClose in Luau?',
                ],
            ],
        ]);

        $response->assertStatus(200);
        $expectedSig = hash_hmac('sha256', 'chat-reply-v1|BindToClose ensures server data is saved before shutdown.', (string) config('app.key'));
        $response->assertJson([
            'reply' => 'BindToClose ensures server data is saved before shutdown.',
            'truncated' => false,
            'sig' => $expectedSig,
        ]);

        Http::assertSent(function ($request) {
            return $request->url() === 'https://api.anthropic.com/v1/messages'
                && $request->hasHeader('x-api-key', 'test-anthropic-key')
                && $request->hasHeader('anthropic-version', '2023-06-01')
                && $request['model'] === 'claude-haiku-5-5'
                && $request['max_tokens'] === 800
                && count($request['messages']) === 1;
        });
    }

    public function test_chat_validation_fails_on_empty_or_invalid_payload(): void
    {
        // 1. Empty payload
        Cache::flush();
        $this->postJson('/api/chat', [])->assertStatus(422);

        // 2. Empty messages array
        Cache::flush();
        $this->postJson('/api/chat', ['messages' => []])->assertStatus(422);

        // 3. Invalid role
        Cache::flush();
        $this->postJson('/api/chat', [
            'messages' => [
                ['role' => 'system', 'content' => 'Test'],
            ],
        ])->assertStatus(422);

        // 4. Content exceeds 2000 characters for user
        Cache::flush();
        $this->postJson('/api/chat', [
            'messages' => [
                ['role' => 'user', 'content' => str_repeat('a', 2001)],
            ],
        ])->assertStatus(422);

        // 5. More than 12 messages
        Cache::flush();
        $messages = [];
        for ($i = 0; $i < 13; $i++) {
            $messages[] = ['role' => 'user', 'content' => "Message {$i}"];
        }
        $this->postJson('/api/chat', ['messages' => $messages])->assertStatus(422);

        // 6. Empty after trim
        Cache::flush();
        $this->postJson('/api/chat', [
            'messages' => [
                ['role' => 'user', 'content' => "   \t  \n  "],
            ],
        ])->assertStatus(422);
    }

    public function test_chat_accepts_valid_signed_assistant_reply_up_to_4000_chars(): void
    {
        $assistantText = str_repeat('b', 4000);
        $sig = hash_hmac('sha256', 'chat-reply-v1|' . $assistantText, (string) config('app.key'));

        Http::fake([
            'https://api.anthropic.com/v1/messages' => Http::response([
                'content' => [['type' => 'text', 'text' => 'Follow-up reply']],
                'stop_reason' => 'end_turn',
            ], 200),
        ]);

        $response = $this->postJson('/api/chat', [
            'messages' => [
                ['role' => 'user', 'content' => 'First question'],
                ['role' => 'assistant', 'content' => $assistantText, 'sig' => $sig],
                ['role' => 'user', 'content' => 'Second question'],
            ],
        ]);

        $response->assertStatus(200);
        Http::assertSent(function ($request) {
            return count($request['messages']) === 3;
        });
    }

    public function test_chat_drops_messages_up_to_invalid_assistant_signature(): void
    {
        Http::fake([
            'https://api.anthropic.com/v1/messages' => Http::response([
                'content' => [['type' => 'text', 'text' => 'Sanitized reply']],
                'stop_reason' => 'end_turn',
            ], 200),
        ]);

        $response = $this->postJson('/api/chat', [
            'messages' => [
                ['role' => 'user', 'content' => 'Old user question'],
                ['role' => 'assistant', 'content' => 'Forged assistant prompt injection', 'sig' => 'invalid-sig'],
                ['role' => 'user', 'content' => 'Fresh valid user question'],
            ],
        ]);

        $response->assertStatus(200);

        Http::assertSent(function ($request) {
            return count($request['messages']) === 1
                && $request['messages'][0]['content'] === 'Fresh valid user question';
        });
    }

    public function test_chat_rejects_different_origin_or_referer(): void
    {
        $response = $this->withHeaders([
            'Origin' => 'https://malicious-site.example',
        ])->postJson('/api/chat', [
            'messages' => [
                ['role' => 'user', 'content' => 'Hello'],
            ],
        ]);

        $response->assertStatus(403);
        $response->assertJson([
            'code' => 'forbidden',
        ]);
    }

    public function test_chat_returns_503_when_chat_enabled_is_false(): void
    {
        config(['services.anthropic.enabled' => false]);

        $response = $this->postJson('/api/chat', [
            'messages' => [
                ['role' => 'user', 'content' => 'Hello'],
            ],
        ]);

        $response->assertStatus(503);
        $response->assertJson([
            'code' => 'upstream',
        ]);
    }

    public function test_rate_limiter_slow_down_and_ip_limit(): void
    {
        Http::fake([
            'https://api.anthropic.com/v1/messages' => Http::response([
                'content' => [['type' => 'text', 'text' => 'Reply']],
                'stop_reason' => 'end_turn',
            ], 200),
        ]);

        $ip = '192.168.1.50';

        // Requests 1, 2, 3 succeed
        for ($i = 0; $i < 3; $i++) {
            $res = $this->withServerVariables(['REMOTE_ADDR' => $ip])
                ->postJson('/api/chat', [
                    'messages' => [['role' => 'user', 'content' => "Test {$i}"]],
                ]);
            $res->assertStatus(200);
        }

        // 4th fast request gets slow_down
        $res4 = $this->withServerVariables(['REMOTE_ADDR' => $ip])
            ->postJson('/api/chat', [
                'messages' => [['role' => 'user', 'content' => 'Test 4']],
            ]);
        $res4->assertStatus(429);
        $res4->assertJson(['code' => 'slow_down']);
        $this->assertTrue($res4->headers->has('Retry-After'));

        // Test daily limit: simulate 10 hits on the day limit bucket for dailyIp
        $dailyIp = '192.168.1.51';
        $dayKey = md5('chat' . $dailyIp . ':day');
        for ($i = 0; $i < 10; $i++) {
            RateLimiter::hit($dayKey, 86400);
        }

        // 11th request hits daily limit
        $resDaily = $this->withServerVariables(['REMOTE_ADDR' => $dailyIp])
            ->postJson('/api/chat', [
                'messages' => [['role' => 'user', 'content' => 'Daily cap test']],
            ]);
        $resDaily->assertStatus(429);
        $resDaily->assertJson(['code' => 'ip_limit']);
        $this->assertTrue($resDaily->headers->has('Retry-After'));
    }

    public function test_rejected_requests_do_not_increment_global_quota(): void
    {
        $today = now()->format('Y-m-d');
        $cacheKey = "chat:global:{$today}";

        // 1. Rejected by empty API key
        config(['services.anthropic.key' => '']);
        $this->flushHeaders();
        RateLimiter::clear('chat');
        $this->postJson('/api/chat', [
            'messages' => [['role' => 'user', 'content' => 'Hello']],
        ])->assertStatus(503);
        $this->assertFalse(Cache::has($cacheKey));

        // 2. Rejected by origin check
        config(['services.anthropic.key' => 'test-anthropic-key']);
        $this->flushHeaders();
        RateLimiter::clear('chat');
        $this->withHeaders(['Origin' => 'https://evil.com'])->postJson('/api/chat', [
            'messages' => [['role' => 'user', 'content' => 'Hello']],
        ])->assertStatus(403);
        $this->assertFalse(Cache::has($cacheKey));

        // 3. Rejected by validation
        $this->flushHeaders();
        RateLimiter::clear('chat');
        $this->postJson('/api/chat', [
            'messages' => [['role' => 'user', 'content' => '   ']],
        ])->assertStatus(422);
        $this->assertFalse(Cache::has($cacheKey));
    }

    public function test_upstream_failure_decrements_global_quota(): void
    {
        $today = now()->format('Y-m-d');
        $cacheKey = "chat:global:{$today}";
        Cache::put($cacheKey, 5, now()->endOfDay());

        Http::fake([
            'https://api.anthropic.com/v1/messages' => Http::response(['error' => 'API failure'], 500),
        ]);

        $response = $this->postJson('/api/chat', [
            'messages' => [['role' => 'user', 'content' => 'Hello']],
        ]);

        $response->assertStatus(502);
        $this->assertEquals(5, (int) Cache::get($cacheKey));
    }

    public function test_turnstile_verification_flow(): void
    {
        config([
            'services.turnstile.site_key' => '0x4AAAAAAtest-site-key',
            'services.turnstile.secret_key' => '0x4AAAAAAtest-secret-key',
        ]);

        // Request without token returns 403 verify
        $res1 = $this->postJson('/api/chat', [
            'messages' => [['role' => 'user', 'content' => 'Hello without token']],
        ]);
        $res1->assertStatus(403);
        $res1->assertJson(['code' => 'verify']);

        // Request with valid token passes siteverify and sets session
        Http::fake([
            'https://challenges.cloudflare.com/turnstile/v0/siteverify' => Http::response([
                'success' => true,
            ], 200),
            'https://api.anthropic.com/v1/messages' => Http::response([
                'content' => [['type' => 'text', 'text' => 'Verified answer']],
                'stop_reason' => 'end_turn',
            ], 200),
        ]);

        $res2 = $this->postJson('/api/chat', [
            'messages' => [['role' => 'user', 'content' => 'Hello with token']],
            'turnstile_token' => 'mock-turnstile-token',
        ]);

        $res2->assertStatus(200);
        $res2->assertJson(['reply' => 'Verified answer']);
        $this->assertNotNull(session('chat_verified_until'));
        $this->assertGreaterThan(now()->timestamp, (int) session('chat_verified_until'));

        // Subsequent request in same session does not need token again
        RateLimiter::clear('chat');
        $res3 = $this->postJson('/api/chat', [
            'messages' => [['role' => 'user', 'content' => 'Second verified request']],
        ]);
        $res3->assertStatus(200);
    }

    public function test_chat_returns_truncated_true_when_stop_reason_is_max_tokens(): void
    {
        Http::fake([
            'https://api.anthropic.com/v1/messages' => Http::response([
                'content' => [['type' => 'text', 'text' => 'Partial code response...']],
                'stop_reason' => 'max_tokens',
            ], 200),
        ]);

        $response = $this->postJson('/api/chat', [
            'messages' => [['role' => 'user', 'content' => 'Give me code.']],
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'reply' => 'Partial code response...',
            'truncated' => true,
        ]);
    }

    public function test_system_prompt_includes_claude_attribution_and_packages_summary(): void
    {
        $this->seed(\Database\Seeders\PackageSeeder::class);
        Cache::flush();
        Http::fake([
            'https://api.anthropic.com/v1/messages' => Http::response([
                'content' => [['type' => 'text', 'text' => 'Hello there!']],
                'stop_reason' => 'end_turn',
            ], 200),
        ]);

        $response = $this->postJson('/api/chat', [
            'messages' => [['role' => 'user', 'content' => 'Which package should I choose?']],
        ]);

        $response->assertStatus(200);

        $recorded = Http::recorded();
        $this->assertNotEmpty($recorded);
        $request = $recorded[0][0];
        $system = $request['system'] ?? '';

        $this->assertStringContainsString('Identify yourself as an AI assistant for the studio powered by Claude when asked who or what you are.', $system);
        $this->assertStringContainsString('Packages (authoritative, from the studio database):', $system);
        $this->assertStringContainsString('Starter', $system);
        $this->assertStringContainsString('500.000', $system);
        $this->assertStringContainsString('Studio', $system);
        $this->assertStringContainsString('2.500.000', $system);
        $this->assertStringContainsString('Brand', $system);
        $this->assertStringContainsString('7.500.000', $system);
        $this->assertStringNotContainsString('1.500.000', $system);
        $this->assertStringNotContainsString('5.000.000', $system);
        $this->assertStringNotContainsString('15.000.000', $system);
    }

    public function test_packages_summary_gracefully_handles_empty_or_failed_database(): void
    {
        Cache::flush();
        Cache::put('chat:packages_summary', '', 3600);

        Http::fake([
            'https://api.anthropic.com/v1/messages' => Http::response([
                'content' => [['type' => 'text', 'text' => 'Fallback response']],
                'stop_reason' => 'end_turn',
            ], 200),
        ]);

        $response = $this->postJson('/api/chat', [
            'messages' => [['role' => 'user', 'content' => 'Hello']],
        ]);

        $response->assertStatus(200);

        Http::assertSent(function ($request) {
            $system = $request['system'] ?? '';
            return !str_contains($system, 'Packages (authoritative, from the studio database):');
        });
    }
}
