<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class CalculatorController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Calculator', [
            'meta' => [
                'title'       => 'Robux Marketplace Fee & DevEx Calculator: ' . config('business.name'),
                'description' => 'Calculate Roblox 30% marketplace cut, simulate net gamepass earnings, and estimate DevEx cashout value in USD and IDR.',
            ],
        ]);
    }
}
