<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Inertia\Inertia;
use Inertia\Response;

class PackagesController extends Controller
{
    public function __invoke(): Response
    {
        $packages = Package::active()->get();

        return Inertia::render('Packages', [
            'packages' => $packages,
            'meta' => [
                'title'       => 'Packages & Pricing: ' . config('business.name'),
                'description' => 'Three clear consulting tiers to fit your project stage. Starting from Rp 500.000.',
            ],
        ]);
    }
}
