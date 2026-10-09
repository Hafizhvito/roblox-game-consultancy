@extends('admin.layout')
@section('title', 'Inquiry from ' . $inquiry->name)
@section('content')
<div style="margin-bottom: 16px;">
    <a href="{{ route('admin.inquiries.index') }}" class="btn btn-secondary btn-sm">&larr; Back to Inquiries</a>
</div>

<div class="card">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #f0ebe4; padding-bottom: 16px; margin-bottom: 20px;">
        <div>
            <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 4px;">{{ $inquiry->name }}</h2>
            <div style="font-size: 14px; color: #5B5963;">
                <a href="mailto:{{ $inquiry->email }}" style="color: #2B2A33; font-weight: 500;">{{ $inquiry->email }}</a> &middot; Received {{ $inquiry->created_at->format('l, F j, Y \a\t g:i A') }}
            </div>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
            <form method="POST" action="{{ route('admin.inquiries.status', $inquiry) }}" style="display: inline-flex; gap: 8px; align-items: center;">
                @csrf
                @method('PATCH')
                <select name="status" onchange="this.form.submit()" style="padding: 6px 10px; border-radius: 6px; border: 1px solid #e8e2da; font-size: 13px;">
                    <option value="new" {{ $inquiry->status === 'new' ? 'selected' : '' }}>New</option>
                    <option value="read" {{ $inquiry->status === 'read' ? 'selected' : '' }}>Read</option>
                    <option value="archived" {{ $inquiry->status === 'archived' ? 'selected' : '' }}>Archived</option>
                </select>
            </form>
            <form method="POST" action="{{ route('admin.inquiries.destroy', $inquiry) }}" onsubmit="return confirm('Delete this inquiry permanently?');">
                @csrf
                @method('DELETE')
                <button type="submit" class="btn btn-danger btn-sm">Delete</button>
            </form>
        </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; background: #faf7f4; padding: 16px; border-radius: 8px;">
        <div>
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #5B5963;">Project Scope / Type</div>
            <div style="font-size: 15px; font-weight: 600; margin-top: 4px;">{{ str_replace('-', ' ', ucfirst($inquiry->project_type)) }}</div>
        </div>
        <div>
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #5B5963;">Budget Range</div>
            <div style="font-size: 15px; font-weight: 600; margin-top: 4px;">{{ str_replace('-', ' ', $inquiry->budget_range) }}</div>
        </div>
        <div>
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #5B5963;">Sender IP</div>
            <div style="font-size: 13px; color: #5B5963; margin-top: 4px;">{{ $inquiry->ip_address ?? 'Not recorded' }}</div>
        </div>
        <div>
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #5B5963;">Browser / Client</div>
            <div style="font-size: 12px; color: #5B5963; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="{{ $inquiry->user_agent }}">{{ $inquiry->user_agent ?? 'Unknown' }}</div>
        </div>
    </div>

    <div>
        <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #5B5963; margin-bottom: 8px;">Inquiry Message</h3>
        <div style="background: #FBF7F2; border: 1px solid #e8e2da; border-radius: 8px; padding: 20px; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">{{ $inquiry->message }}</div>
    </div>

    <div style="margin-top: 24px; display: flex; gap: 12px;">
        <a href="mailto:{{ $inquiry->email }}?subject=Re:%20Roblox%20Project%20Inquiry%20via%20{{ rawurlencode(config('business.name')) }}" class="btn btn-primary">
            Reply via Email &rarr;
        </a>
    </div>
</div>
@endsection
