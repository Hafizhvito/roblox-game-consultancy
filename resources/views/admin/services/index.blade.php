@extends('admin.layout')
@section('title', 'Manage Services')
@section('content')
<div class="card">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div>
            <h2 style="font-size: 16px; font-weight: 700;">All Services</h2>
            <p style="font-size: 13px; color: #5B5963;">Active services appear across the home page and services catalog.</p>
        </div>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Order</th>
                <th>Service Name</th>
                <th>Tagline</th>
                <th>Target Audience</th>
                <th>Status</th>
                <th style="text-align: right;">Action</th>
            </tr>
        </thead>
        <tbody>
            @foreach($services as $service)
            <tr>
                <td style="font-weight: 600; width: 60px;">#{{ $service->sort_order }}</td>
                <td>
                    <strong>{{ $service->title }}</strong><br>
                    <span style="font-size: 12px; color: #5B5963;">/services ({{ $service->slug }})</span>
                </td>
                <td style="font-size: 13px; color: #5B5963;">{{ $service->tagline }}</td>
                <td style="font-size: 12px; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ $service->suits }}</td>
                <td>
                    @if($service->is_active)
                        <span class="status-badge status-read">Active</span>
                    @else
                        <span class="status-badge status-archived">Disabled</span>
                    @endif
                </td>
                <td style="text-align: right;">
                    <a href="{{ route('admin.services.edit', $service) }}" class="btn btn-secondary btn-sm">Edit</a>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection
