<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class SnippetController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Snippets', [
            'meta' => [
                'title'       => 'Luau Code Vault & Architecture Tips: ' . config('business.name'),
                'description' => 'Production-grade Luau code snippets for Roblox developers: anti-exploit networking, DataStore BindToClose lifecycle, and receipt purchase handlers.',
            ],
        ]);
    }
}
