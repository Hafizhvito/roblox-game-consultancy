<?php

return [
    'anthropic' => [
        'enabled' => filter_var(env('CHAT_ENABLED', true), FILTER_VALIDATE_BOOLEAN),
        'key' => env('ANTHROPIC_API_KEY'),
        'model' => 'claude-haiku-5-5',
        'daily_cap' => (int) env('CHAT_DAILY_GLOBAL_CAP', 150),
    ],
    'turnstile' => [
        'site_key' => env('TURNSTILE_SITE_KEY'),
        'secret_key' => env('TURNSTILE_SECRET_KEY'),
    ],
];
