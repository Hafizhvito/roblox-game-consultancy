<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class PackageController extends Controller
{
    public function index(): View
    {
        $packages = Package::orderBy('sort_order')->get();
        return view('admin.packages.index', compact('packages'));
    }

    public function edit(Package $package): View
    {
        return view('admin.packages.edit', compact('package'));
    }

    public function update(Request $request, Package $package): RedirectResponse
    {
        $validated = $request->validate([
            'name'           => ['required', 'string', 'max:80'],
            'tagline'        => ['required', 'string', 'max:200'],
            'price_idr_from' => ['required', 'integer', 'min:0'],
            'description'    => ['required', 'string'],
            'features'       => ['required', 'string'], // newline-separated
            'cta_label'      => ['required', 'string', 'max:60'],
            'is_highlighted' => ['boolean'],
            'sort_order'     => ['required', 'integer', 'min:0'],
            'is_active'      => ['boolean'],
        ]);

        $package->update([
            ...$validated,
            'features'       => array_filter(array_map('trim', explode("\n", $validated['features']))),
            'is_highlighted' => $request->boolean('is_highlighted'),
            'is_active'      => $request->boolean('is_active'),
        ]);

        return redirect()->route('admin.packages.index')->with('success', 'Package updated.');
    }
}
