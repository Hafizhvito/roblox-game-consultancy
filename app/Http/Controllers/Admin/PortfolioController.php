<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PortfolioItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class PortfolioController extends Controller
{
    public function index(): View
    {
        $items = PortfolioItem::orderBy('sort_order')->get();
        return view('admin.portfolio.index', compact('items'));
    }

    public function edit(PortfolioItem $item): View
    {
        return view('admin.portfolio.edit', compact('item'));
    }

    public function update(Request $request, PortfolioItem $item): RedirectResponse
    {
        $validated = $request->validate([
            'title'        => ['required', 'string', 'max:120'],
            'client'       => ['required', 'string', 'max:120'],
            'category'     => ['required', 'string', 'max:80'],
            'accent_color' => ['required', 'string', 'in:peach,mint,lavender,butter,sky'],
            'summary'      => ['required', 'string', 'max:400'],
            'problem'      => ['required', 'string'],
            'approach'     => ['required', 'string'],
            'outcome'      => ['required', 'string'],
            'tools_used'   => ['required', 'string'], // comma-separated
            'sort_order'   => ['required', 'integer', 'min:0'],
            'is_featured'  => ['boolean'],
            'is_active'    => ['boolean'],
        ]);

        $item->update([
            ...$validated,
            'tools_used'  => array_filter(array_map('trim', explode(',', $validated['tools_used']))),
            'is_featured' => $request->boolean('is_featured'),
            'is_active'   => $request->boolean('is_active'),
        ]);

        return redirect()->route('admin.portfolio.index')->with('success', 'Portfolio item updated.');
    }

    public function toggleFeatured(PortfolioItem $item): RedirectResponse
    {
        $item->update(['is_featured' => !$item->is_featured]);
        return back()->with('success', 'Featured status updated.');
    }
}
