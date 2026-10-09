@extends('admin.layout')
@section('title', 'Edit Service: ' . $service->title)
@section('content')
<div style="margin-bottom: 16px;">
    <a href="{{ route('admin.services.index') }}" class="btn btn-secondary btn-sm">&larr; Back to Services</a>
</div>

<div class="card" style="max-width: 760px;">
    <form method="POST" action="{{ route('admin.services.update', $service) }}">
        @csrf
        @method('PUT')

        <div class="form-group">
            <label for="title">Service Title</label>
            <input type="text" id="title" name="title" value="{{ old('title', $service->title) }}" required>
            @error('title') <div class="error-msg">{{ $message }}</div> @enderror
        </div>

        <div class="form-group">
            <label for="tagline">Short Tagline</label>
            <input type="text" id="tagline" name="tagline" value="{{ old('tagline', $service->tagline) }}" required>
            @error('tagline') <div class="error-msg">{{ $message }}</div> @enderror
        </div>

        <div class="form-group">
            <label for="description">Full Service Description</label>
            <textarea id="description" name="description" rows="5" required>{{ old('description', $service->description) }}</textarea>
            @error('description') <div class="error-msg">{{ $message }}</div> @enderror
        </div>

        <div class="form-group">
            <label for="deliverables">Key Deliverables (one item per line)</label>
            <textarea id="deliverables" name="deliverables" rows="6" required>{{ old('deliverables', is_array($service->deliverables) ? implode("\n", $service->deliverables) : $service->deliverables) }}</textarea>
            <small style="color: #5B5963;">Enter each deliverable on a new line.</small>
            @error('deliverables') <div class="error-msg">{{ $message }}</div> @enderror
        </div>

        <div class="form-group">
            <label for="suits">Who this suits</label>
            <textarea id="suits" name="suits" rows="3" required>{{ old('suits', $service->suits) }}</textarea>
            @error('suits') <div class="error-msg">{{ $message }}</div> @enderror
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group">
                <label for="sort_order">Display Sort Order</label>
                <input type="number" id="sort_order" name="sort_order" value="{{ old('sort_order', $service->sort_order) }}" required>
                @error('sort_order') <div class="error-msg">{{ $message }}</div> @enderror
            </div>

            <div class="form-group" style="display: flex; flex-direction: column; justify-content: center;">
                <label style="margin-bottom: 8px;">Active Visibility</label>
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                    <input type="checkbox" name="is_active" value="1" {{ old('is_active', $service->is_active) ? 'checked' : '' }} style="width: auto; margin-bottom: 0;">
                    <span>Show this service publicly</span>
                </label>
            </div>
        </div>

        <div style="margin-top: 24px; display: flex; gap: 12px;">
            <button type="submit" class="btn btn-primary">Save Changes</button>
            <a href="{{ route('admin.services.index') }}" class="btn btn-secondary">Cancel</a>
        </div>
    </form>
</div>
@endsection
