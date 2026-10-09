<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class ServicesController extends Controller
{
    public function __invoke(): Response
    {
        $services = Service::active()->get();

        return Inertia::render('Services', [
            'services' => $services,
            'meta' => [
                'title'       => 'Services: ' . config('business.name'),
                'description' => 'From game concept and design to Luau architecture, monetisation, and launch strategy. See how we can help your Roblox project.',
            ],
        ]);
    }
}
