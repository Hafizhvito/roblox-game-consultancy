@extends('admin.layout')
@section('title', 'Edit Package: ' . $package->name)
@section('content')
<div style="margin-bottom: 16px;">
    <a href="{{ route('admin.packages.index') }}" class="btn btn-secondary btn-sm">&larr; Back to Packages</a>
</div>

<div class="card" style="max-width: 760px;">
    <form method="POST" action="{{ route('admin.packages.update', $package) }}">
        @csrf
        @method('PUT')

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group">
                <label for="name">Package Name</label>
                <input type="text" id="name" name="name" value="{{ old('name', $package->name) }}" required>
                @error('name') <div class="error-msg">{{ $message }}</div> @enderror
            </div>

            <div class="form-group">
                <label for="price_idr_from">Starting Price (IDR Number Only)</label>
                <input type="number" id="price_idr_from" name="price_idr_from" value="{{ old('price_idr_from', $package->price_idr_from) }}" required min="0" step="50000">
                <small style="color: #5B5963;">e.g., 500000 displays as Rp 500.000</small>
                @error('price_idr_from') <div class="error-msg">{{ $message }}</div> @enderror
            </div>
        </div>

        <div class="form-group">
            <label for="tagline">Tagline</label>
            <input type="text" id="tagline" name="tagline" value="{{ old('tagline', $package->tagline) }}" required>
            @error('tagline') <div class="error-msg">{{ $message }}</div> @enderror
        </div>

        <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="description" rows="3" required>{{ old('description', $package->description) }}</textarea>
            @error('description') <div class="error-msg">{{ $message }}</div> @enderror
        </div>

        <div class="form-group">
            <label for="features">Included Features / Deliverables (one per line)</label>
            <textarea id="features" name="features" rows="6" required>{{ old('features', is_array($package->features) ? implode("\n", $package->features) : $package->features) }}</textarea>
            <small style="color: #5B5963;">Each line becomes a bullet point in the pricing card.</small>
            @error('features') <div class="error-msg">{{ $message }}</div> @enderror
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group">
                <label for="cta_label">Button / CTA Label</label>
                <input type="text" id="cta_label" name="cta_label" value="{{ old('cta_label', $package->cta_label) }}" required>
                @error('cta_label') <div class="error-msg">{{ $message }}</div> @enderror
            </div>

            <div class="form-group">
                <label for="sort_order">Sort Order</label>
                <input type="number" id="sort_order" name="sort_order" value="{{ old('sort_order', $package->sort_order) }}" required>
                @error('sort_order') <div class="error-msg">{{ $message }}</div> @enderror
            </div>
        </div>

        <div style="display: flex; gap: 24px; margin-top: 8px; margin-bottom: 24px;">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" name="is_highlighted" value="1" {{ old('is_highlighted', $package->is_highlighted) ? 'checked' : '' }} style="width: auto; margin-bottom: 0;">
                <span>Highlight as recommended/middle tier</span>
            </label>
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" name="is_active" value="1" {{ old('is_active', $package->is_active) ? 'checked' : '' }} style="width: auto; margin-bottom: 0;">
                <span>Active and visible</span>
            </label>
        </div>

        <div style="display: flex; gap: 12px;">
            <button type="submit" class="btn btn-primary">Save Package</button>
            <a href="{{ route('admin.packages.index') }}" class="btn btn-secondary">Cancel</a>
        </div>
    </form>
</div>
@endsection
