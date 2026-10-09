<?php

namespace App\Http\Controllers;

use App\Models\PortfolioItem;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioController extends Controller
{
    public function index(): Response
    {
        $items = PortfolioItem::active()->get([
            'id', 'slug', 'title', 'client', 'category', 'summary', 'accent_color', 'is_featured',
        ]);

        return Inertia::render('Portfolio/Index', [
            'items' => $items,
            'meta' => [
                'title'       => 'Portfolio: ' . config('business.name'),
                'description' => 'Real projects: game design, Luau architecture, monetisation strategy, and launch planning for Roblox experiences.',
            ],
        ]);
    }

    public function show(string $slug): Response|RedirectResponse
    {
        $item = PortfolioItem::where('slug', $slug)->where('is_active', true)->firstOrFail();

        return Inertia::render('Portfolio/Show', [
            'item' => $item,
            'meta' => [
                'title'       => $item->title . ': ' . config('business.name'),
                'description' => $item->summary,
            ],
        ]);
    }
}
