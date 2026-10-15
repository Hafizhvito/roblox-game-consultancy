<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
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
    }
}
