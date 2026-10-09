<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('About', [
            'meta' => [
                'title'       => 'About: ' . config('business.name'),
                'description' => 'Who is behind the consultancy, what we have shipped, and the tools we use every day.',
            ],
        ]);
    }
}
