@extends('admin.layout')
@section('title', 'Manage Portfolio')
@section('content')
<div class="card">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div>
            <h2 style="font-size: 16px; font-weight: 700;">Portfolio Case Studies</h2>
            <p style="font-size: 13px; color: #5B5963;">Manage your project cards, detailed writeups, tools used, and featured flags.</p>
        </div>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Title & Client</th>
                <th>Category</th>
                <th>Accent Color</th>
                <th>Featured</th>
                <th>Status</th>
                <th style="text-align: right;">Action</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $item)
            <tr>
                <td>
                    <strong>{{ $item->title }}</strong><br>
                    <span style="font-size: 12px; color: #5B5963;">Client: {{ $item->client }}</span>
                </td>
                <td>{{ $item->category }}</td>
                <td>
                    <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background-color: var(--color-{{ $item->accent_color }}, #ddd); margin-right: 4px; vertical-align: middle;"></span>
                    <span style="font-size: 13px;">{{ ucfirst($item->accent_color) }}</span>
                </td>
                <td>
                    <form method="POST" action="{{ route('admin.portfolio.featured', $item) }}" style="display: inline;">
                        @csrf
                        @method('PATCH')
                        <button type="submit" class="btn btn-sm {{ $item->is_featured ? 'btn-primary' : 'btn-secondary' }}" title="Click to toggle featured">
                            {{ $item->is_featured ? '★ Featured on Home' : '☆ Standard' }}
                        </button>
                    </form>
                </td>
                <td>
                    @if($item->is_active)
                        <span class="status-badge status-read">Active</span>
                    @else
                        <span class="status-badge status-archived">Draft</span>
                    @endif
                </td>
                <td style="text-align: right;">
                    <a href="{{ route('portfolio.show', $item->slug) }}" target="_blank" class="btn btn-secondary btn-sm" style="margin-right: 4px;">View</a>
                    <a href="{{ route('admin.portfolio.edit', $item) }}" class="btn btn-secondary btn-sm">Edit</a>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection
