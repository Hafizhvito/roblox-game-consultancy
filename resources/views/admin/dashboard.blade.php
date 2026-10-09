@extends('admin.layout')
@section('title', 'Dashboard')
@section('content')
<div class="stats-grid">
    <div class="stat-card">
        <div class="number" style="color:#e05a1e">{{ $stats['new_inquiries'] }}</div>
        <div class="label">New inquiries</div>
    </div>
    <div class="stat-card">
        <div class="number">{{ $stats['total_inquiries'] }}</div>
        <div class="label">Total inquiries</div>
    </div>
    <div class="stat-card">
        <div class="number">{{ $stats['services'] }}</div>
        <div class="label">Services</div>
    </div>
    <div class="stat-card">
        <div class="number">{{ $stats['portfolio_items'] }}</div>
        <div class="label">Portfolio items</div>
    </div>
</div>

<div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h2 style="font-size:15px;font-weight:600">Recent inquiries</h2>
        <a href="{{ route('admin.inquiries.index') }}" class="btn btn-secondary btn-sm">View all</a>
    </div>
    @if($recentInquiries->isEmpty())
        <p style="color:#5B5963;font-size:14px">No inquiries yet.</p>
    @else
    <table class="table">
        <thead>
            <tr><th>Name</th><th>Project type</th><th>Budget</th><th>Received</th><th>Status</th><th></th></tr>
        </thead>
        <tbody>
            @foreach($recentInquiries as $inquiry)
            <tr>
                <td><strong>{{ $inquiry->name }}</strong><br><span style="font-size:12px;color:#5B5963">{{ $inquiry->email }}</span></td>
                <td>{{ str_replace('-', ' ', ucfirst($inquiry->project_type)) }}</td>
                <td>{{ str_replace('-', ' ', $inquiry->budget_range) }}</td>
                <td style="font-size:12px;color:#5B5963">{{ $inquiry->created_at->diffForHumans() }}</td>
                <td><span class="status-badge status-{{ $inquiry->status }}">{{ $inquiry->status }}</span></td>
                <td><a href="{{ route('admin.inquiries.show', $inquiry) }}" class="btn btn-secondary btn-sm">View</a></td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif
</div>
@endsection
