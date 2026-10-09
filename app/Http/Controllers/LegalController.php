<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class LegalController extends Controller
{
    public function privacy(): Response
    {
        return Inertia::render('Legal/Privacy', [
            'meta' => [
                'title'       => 'Privacy Policy: ' . config('business.name'),
                'description' => 'How we collect, use, and protect your personal information.',
            ],
        ]);
    }

    public function terms(): Response
    {
        return Inertia::render('Legal/Terms', [
            'meta' => [
                'title'       => 'Terms of Service: ' . config('business.name'),
                'description' => 'Terms and conditions for using our consulting services.',
            ],
        ]);
    }
}
