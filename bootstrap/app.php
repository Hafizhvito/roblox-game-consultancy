<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Inertia share middleware
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        // Middleware aliases
        $middleware->alias([
            'honeypot' => \App\Http\Middleware\Honeypot::class,
            'admin'    => \App\Http\Middleware\EnsureUserIsAdmin::class,
        ]);

        $middleware->redirectGuestsTo('/admin/login');
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })
    ->booted(function () {
        RateLimiter::for('contact', function (Request $request) {
            return Limit::perHour(5)->by($request->ip());
        });

        RateLimiter::for('chat', function (Request $request) {
            $ip = $request->ip();

            return [
                Limit::perMinute(3)->by($ip . ':minute')->response(function (Request $request, array $headers) {
                    return response()->json([
                        'reply' => 'You are sending messages too quickly. Please wait a moment and try again.',
                        'code' => 'slow_down',
                    ], 429, $headers);
                }),
                Limit::perDay(10)->by($ip . ':day')->response(function (Request $request, array $headers) {
                    return response()->json([
                        'reply' => 'You have reached the per-IP message limit for today. If you need direct advisory, please get in touch.',
                        'code' => 'ip_limit',
                    ], 429, $headers);
                }),
            ];
        });
    })
    ->create();
