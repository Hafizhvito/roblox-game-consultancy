<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Honeypot
{
    public function handle(Request $request, Closure $next): Response
    {
        // The honeypot field is named 'website': bots fill it, humans leave it empty
        if ($request->filled('website')) {
            // Silently return 200 to confuse scrapers
            return response()->json(['message' => 'Thank you!']);
        }

        return $next($request);
    }
}
