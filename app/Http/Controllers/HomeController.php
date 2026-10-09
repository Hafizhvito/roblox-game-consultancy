<?php

namespace App\Http\Controllers;

use App\Models\PortfolioItem;
use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $services  = Service::active()->get(['id', 'slug', 'title', 'tagline', 'icon_key']);
        $featured  = PortfolioItem::active()->featured()->get(['id', 'slug', 'title', 'category', 'summary', 'accent_color']);

        return Inertia::render('Home', [
            'services' => $services,
            'featured' => $featured,
            'meta' => [
                'title'       => config('business.name') . ': Roblox Game Consulting',
                'description' => config('business.tagline'),
            ],
        ]);
    }
}
