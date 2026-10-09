@extends('admin.layout')
@section('title', 'Inquiries')
@section('content')
<div class="card" style="margin-bottom: 16px;">
    <div style="display: flex; gap: 8px; align-items: center; justify-content: space-between;">
        <div style="display: flex; gap: 8px;">
            <a href="{{ route('admin.inquiries.index') }}" class="btn {{ $status === 'all' ? 'btn-primary' : 'btn-secondary' }} btn-sm">All</a>
            <a href="{{ route('admin.inquiries.index', ['status' => 'new']) }}" class="btn {{ $status === 'new' ? 'btn-primary' : 'btn-secondary' }} btn-sm">New</a>
            <a href="{{ route('admin.inquiries.index', ['status' => 'read']) }}" class="btn {{ $status === 'read' ? 'btn-primary' : 'btn-secondary' }} btn-sm">Read</a>
            <a href="{{ route('admin.inquiries.index', ['status' => 'archived']) }}" class="btn {{ $status === 'archived' ? 'btn-primary' : 'btn-secondary' }} btn-sm">Archived</a>
        </div>
        <span style="font-size: 13px; color: #5B5963;">Showing {{ $inquiries->total() }} inquiries</span>
    </div>
</div>

<div class="card">
    @if($inquiries->isEmpty())
        <p style="color:#5B5963; font-size:14px; text-align:center; padding: 24px 0;">No inquiries found in this view.</p>
    @else
        <table class="table">
            <thead>
                <tr>
                    <th>Sender</th>
                    <th>Project</th>
                    <th>Budget</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th style="text-align: right;">Action</th>
                </tr>
            </thead>
            <tbody>
                @foreach($inquiries as $inquiry)
                <tr>
                    <td>
                        <strong>{{ $inquiry->name }}</strong><br>
                        <a href="mailto:{{ $inquiry->email }}" style="font-size: 12px; color: #5B5963; text-decoration: none;">{{ $inquiry->email }}</a>
                    </td>
                    <td>{{ str_replace('-', ' ', ucfirst($inquiry->project_type)) }}</td>
                    <td>{{ str_replace('-', ' ', $inquiry->budget_range) }}</td>
                    <td style="font-size: 12px; color: #5B5963;">{{ $inquiry->created_at->format('M d, Y H:i') }}</td>
                    <td>
                        <span class="status-badge status-{{ $inquiry->status }}">{{ $inquiry->status }}</span>
                    </td>
                    <td style="text-align: right;">
                        <a href="{{ route('admin.inquiries.show', $inquiry) }}" class="btn btn-secondary btn-sm">Review</a>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
        <div style="margin-top: 16px;">
            {{ $inquiries->appends(['status' => $status])->links() }}
        </div>
    @endif
</div>
@endsection
