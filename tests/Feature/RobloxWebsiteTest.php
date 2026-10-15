<?php

namespace Tests\Feature;

use App\Models\Inquiry;
use App\Models\Package;
use App\Models\PortfolioItem;
use App\Models\Service;
use App\Models\User;
use App\Mail\InquiryReceived;
use Database\Seeders\AdminSeeder;
use Database\Seeders\PackageSeeder;
use Database\Seeders\PortfolioSeeder;
use Database\Seeders\ServiceSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class RobloxWebsiteTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed([
            ServiceSeeder::class,
            PackageSeeder::class,
            PortfolioSeeder::class,
            AdminSeeder::class,
        ]);
    }

    public function test_home_page_renders_successfully(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
        $response->assertSee('Roblox');
    }

    public function test_services_page_renders_with_seeded_services(): void
    {
        $response = $this->get('/services');
        $response->assertStatus(200);
    }

    public function test_packages_page_renders_with_seeded_packages(): void
    {
        $response = $this->get('/packages');
        $response->assertStatus(200);

        $starter = Package::where('slug', 'starter')->first();
        $this->assertNotNull($starter);
        $this->assertEquals(500000, $starter->price_idr_from);
        $this->assertContains('1 scoped consulting session (60 min)', $starter->features);

        $studio = Package::where('slug', 'studio')->first();
        $this->assertNotNull($studio);
        $this->assertEquals(2500000, $studio->price_idr_from);
        $this->assertContains('2 consulting sessions (90 min each)', $studio->features);

        $brand = Package::where('slug', 'brand')->first();
        $this->assertNotNull($brand);
        $this->assertEquals(7500000, $brand->price_idr_from);
        $this->assertContains('Final price quoted after a scoping call', $brand->features);
    }

    public function test_portfolio_index_and_detail_render_successfully(): void
    {
        $response = $this->get('/portfolio');
        $response->assertStatus(200);

        $firstItem = PortfolioItem::first();
        $this->assertNotNull($firstItem);

        $detail = $this->get('/portfolio/' . $firstItem->slug);
        $detail->assertStatus(200);
    }

    public function test_process_and_about_and_legal_pages_render(): void
    {
        $this->get('/process')->assertStatus(200);
        $this->get('/about')->assertStatus(200);
        $this->get('/privacy-policy')->assertStatus(200);
        $this->get('/terms')->assertStatus(200);
    }

    public function test_sitemap_returns_valid_xml(): void
    {
        $response = $this->get('/sitemap.xml');
        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/xml');
        $this->assertStringContainsString('<urlset', $response->getContent());
    }

    public function test_contact_page_renders(): void
    {
        $this->get('/contact')->assertStatus(200);
    }

    public function test_contact_form_saves_inquiry_and_queues_email(): void
    {
        Mail::fake();
        config(['business.owner_notification_email' => 'owner@example.com']);
        config(['business.email' => '[EMAIL_PERUSAHAAN]']);

        $response = $this->post('/contact', [
            'name'         => 'Budi Test',
            'email'        => 'budi@example.com',
            'project_type' => 'game-concept',
            'budget_range' => '2m-5m',
            'message'      => 'We are building an open world tycoon game and need economy balance advice.',
        ]);

        $response->assertRedirect('/contact');
        $this->assertDatabaseHas('inquiries', [
            'name'  => 'Budi Test',
            'email' => 'budi@example.com',
        ]);

        Mail::assertSent(InquiryReceived::class, function ($mail) {
            return $mail->hasTo('owner@example.com');
        });

        Mail::assertNotSent(InquiryReceived::class, function ($mail) {
            return $mail->hasTo('[EMAIL_PERUSAHAAN]');
        });
    }

    public function test_no_gmail_address_appears_in_source_files(): void
    {
        $directories = [
            resource_path(),
            app_path(),
            config_path(),
            database_path('seeders'),
        ];

        $found = [];

        foreach ($directories as $dir) {
            if (!is_dir($dir)) {
                continue;
            }

            $iterator = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($dir, \FilesystemIterator::SKIP_DOTS)
            );

            foreach ($iterator as $file) {
                if ($file->isDir()) {
                    continue;
                }

                $content = file_get_contents($file->getPathname());
                if (preg_match('/[A-Za-z0-9._%+-]+@gmail\.com/i', $content, $matches)) {
                    $found[] = $file->getPathname() . ' (' . $matches[0] . ')';
                }
            }
        }

        $this->assertEmpty($found, 'Found hardcoded gmail.com in source files: ' . implode(', ', $found));
    }

    public function test_honeypot_silently_intercepts_bot_submissions(): void
    {
        $response = $this->post('/contact', [
            'name'         => 'Spam Bot',
            'email'        => 'bot@spam.com',
            'project_type' => 'other',
            'budget_range' => 'under-2m',
            'message'      => 'Spam spam spam spam spam spam spam.',
            'website'      => 'https://spam-link.com',
        ]);

        $this->assertDatabaseMissing('inquiries', [
            'email' => 'bot@spam.com',
        ]);
    }

    public function test_admin_guest_redirected_to_login(): void
    {
        $this->get('/admin')->assertRedirect('/admin/login');
    }

    public function test_admin_user_can_login_and_access_dashboard(): void
    {
        $admin = User::where('is_admin', true)->first();
        $this->assertNotNull($admin);

        $loginResponse = $this->post('/admin/login', [
            'email'    => $admin->email,
            'password' => 'changeme123!',
        ]);

        $loginResponse->assertRedirect('/admin');

        $this->actingAs($admin)
            ->get('/admin')
            ->assertStatus(200)
            ->assertSee('Dashboard');
    }

    public function test_calculator_and_snippets_pages_render(): void
    {
        $this->get('/calculator')->assertStatus(200);
        $this->get('/snippets')->assertStatus(200);
    }

    public function test_early_access_waitlist_signup_stores_record(): void
    {
        $response = $this->postJson('/early-access', [
            'name'    => 'Creator Pro',
            'email'   => 'creator@roblox.com',
            'discord' => 'creator#9999',
        ]);

        $response->assertStatus(200);
        $response->assertJson(['success' => true]);

        $this->assertDatabaseHas('inquiries', [
            'email'        => 'creator@roblox.com',
            'project_type' => 'saas-early-access',
        ]);
    }
}
