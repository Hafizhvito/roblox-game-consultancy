<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class ServiceController extends Controller
{
    public function index(): View
    {
        $services = Service::orderBy('sort_order')->get();
        return view('admin.services.index', compact('services'));
    }

    public function edit(Service $service): View
    {
        return view('admin.services.edit', compact('service'));
    }

    public function update(Request $request, Service $service): RedirectResponse
    {
        $validated = $request->validate([
            'title'        => ['required', 'string', 'max:120'],
            'tagline'      => ['required', 'string', 'max:200'],
            'description'  => ['required', 'string'],
            'deliverables' => ['required', 'string'], // newline-separated list
            'suits'        => ['required', 'string', 'max:500'],
            'sort_order'   => ['required', 'integer', 'min:0'],
            'is_active'    => ['boolean'],
        ]);

        $service->update([
            ...$validated,
            'deliverables' => array_filter(array_map('trim', explode("\n", $validated['deliverables']))),
            'is_active'    => $request->boolean('is_active'),
        ]);

        return redirect()->route('admin.services.index')->with('success', 'Service updated.');
    }
}
