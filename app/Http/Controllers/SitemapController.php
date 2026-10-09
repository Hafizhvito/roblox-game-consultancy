<?php

namespace App\Http\Controllers;

use App\Models\PortfolioItem;
use App\Models\Service;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\URL;

class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $services   = Service::active()->get();
        $portfolio  = PortfolioItem::active()->get();

        $staticRoutes = [
            ['url' => url('/'),               'priority' => '1.0',  'freq' => 'weekly'],
            ['url' => url('/services'),        'priority' => '0.9',  'freq' => 'monthly'],
            ['url' => url('/packages'),        'priority' => '0.9',  'freq' => 'monthly'],
            ['url' => url('/portfolio'),       'priority' => '0.8',  'freq' => 'monthly'],
            ['url' => url('/process'),         'priority' => '0.7',  'freq' => 'monthly'],
            ['url' => url('/calculator'),      'priority' => '0.9',  'freq' => 'weekly'],
            ['url' => url('/snippets'),        'priority' => '0.8',  'freq' => 'weekly'],
            ['url' => url('/about'),           'priority' => '0.7',  'freq' => 'monthly'],
            ['url' => url('/contact'),         'priority' => '0.8',  'freq' => 'yearly'],
            ['url' => url('/privacy-policy'),  'priority' => '0.3',  'freq' => 'yearly'],
            ['url' => url('/terms'),           'priority' => '0.3',  'freq' => 'yearly'],
        ];

        $xml = view('sitemap', [
            'staticRoutes' => $staticRoutes,
            'services'     => $services,
            'portfolio'    => $portfolio,
        ])->render();

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }
}
