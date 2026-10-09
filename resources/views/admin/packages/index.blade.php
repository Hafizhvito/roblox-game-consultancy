@extends('admin.layout')
@section('title', 'Manage Packages & Pricing')
@section('content')
<div class="card">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div>
            <h2 style="font-size: 16px; font-weight: 700;">Consulting Packages</h2>
            <p style="font-size: 13px; color: #5B5963;">All 3 tiers with "starting from" pricing in IDR, directly editable from here.</p>
        </div>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Tier</th>
                <th>Starting Price</th>
                <th>Features Count</th>
                <th>Badge</th>
                <th>Status</th>
                <th style="text-align: right;">Action</th>
            </tr>
        </thead>
        <tbody>
            @foreach($packages as $package)
            <tr>
                <td>
                    <strong>{{ $package->name }}</strong><br>
                    <span style="font-size: 12px; color: #5B5963;">{{ $package->tagline }}</span>
                </td>
                <td style="font-weight: 700; color: #2B2A33;">
                    Rp {{ number_format($package->price_idr_from, 0, ',', '.') }}
                </td>
                <td style="font-size: 13px; color: #5B5963;">
                    {{ is_array($package->features) ? count($package->features) : 0 }} items
                </td>
                <td>
                    @if($package->is_highlighted)
                        <span class="status-badge" style="background: #F8EBB8; color: #6b5500;">Featured Tier</span>
                    @else
                        <span style="font-size: 12px; color: #888;">Standard</span>
                    @endif
                </td>
                <td>
                    @if($package->is_active)
                        <span class="status-badge status-read">Active</span>
                    @else
                        <span class="status-badge status-archived">Disabled</span>
                    @endif
                </td>
                <td style="text-align: right;">
                    <a href="{{ route('admin.packages.edit', $package) }}" class="btn btn-secondary btn-sm">Edit Pricing & Details</a>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection
