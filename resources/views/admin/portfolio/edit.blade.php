@extends('admin.layout')
@section('title', 'Edit Case Study: ' . $item->title)
@section('content')
<div style="margin-bottom: 16px;">
    <a href="{{ route('admin.portfolio.index') }}" class="btn btn-secondary btn-sm">&larr; Back to Portfolio</a>
</div>

<div class="card" style="max-width: 800px;">
    <form method="POST" action="{{ route('admin.portfolio.update', $item) }}">
        @csrf
        @method('PUT')

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px;">
            <div class="form-group">
                <label for="title">Project Title</label>
                <input type="text" id="title" name="title" value="{{ old('title', $item->title) }}" required>
                @error('title') <div class="error-msg">{{ $message }}</div> @enderror
            </div>

            <div class="form-group">
                <label for="client">Client Name / Placeholder</label>
                <input type="text" id="client" name="client" value="{{ old('client', $item->client) }}" required>
                @error('client') <div class="error-msg">{{ $message }}</div> @enderror
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group">
                <label for="category">Category</label>
                <input type="text" id="category" name="category" value="{{ old('category', $item->category) }}" required placeholder="e.g. Luau Architecture, Game Concept">
                @error('category') <div class="error-msg">{{ $message }}</div> @enderror
            </div>

            <div class="form-group">
                <label for="accent_color">Section Accent Pastel</label>
                <select id="accent_color" name="accent_color" required>
                    <option value="peach" {{ old('accent_color', $item->accent_color) === 'peach' ? 'selected' : '' }}>Peach (#F9D5C5)</option>
                    <option value="mint" {{ old('accent_color', $item->accent_color) === 'mint' ? 'selected' : '' }}>Mint (#CFE8DC)</option>
                    <option value="lavender" {{ old('accent_color', $item->accent_color) === 'lavender' ? 'selected' : '' }}>Lavender (#DCD3F0)</option>
                    <option value="butter" {{ old('accent_color', $item->accent_color) === 'butter' ? 'selected' : '' }}>Butter (#F8EBB8)</option>
                    <option value="sky" {{ old('accent_color', $item->accent_color) === 'sky' ? 'selected' : '' }}>Sky (#CFE3F3)</option>
                </select>
                @error('accent_color') <div class="error-msg">{{ $message }}</div> @enderror
            </div>
        </div>

        <div class="form-group">
            <label for="summary">Short Card Summary</label>
            <textarea id="summary" name="summary" rows="3" required>{{ old('summary', $item->summary) }}</textarea>
            @error('summary') <div class="error-msg">{{ $message }}</div> @enderror
        </div>

        <div class="form-group">
            <label for="problem">The Problem</label>
            <textarea id="problem" name="problem" rows="4" required>{{ old('problem', $item->problem) }}</textarea>
            @error('problem') <div class="error-msg">{{ $message }}</div> @enderror
        </div>

        <div class="form-group">
            <label for="approach">Our Approach</label>
            <textarea id="approach" name="approach" rows="4" required>{{ old('approach', $item->approach) }}</textarea>
            @error('approach') <div class="error-msg">{{ $message }}</div> @enderror
        </div>

        <div class="form-group">
            <label for="outcome">Outcome & Results</label>
            <textarea id="outcome" name="outcome" rows="4" required>{{ old('outcome', $item->outcome) }}</textarea>
            @error('outcome') <div class="error-msg">{{ $message }}</div> @enderror
        </div>

        <div class="form-group">
            <label for="tools_used">Tools Used (comma-separated)</label>
            <input type="text" id="tools_used" name="tools_used" value="{{ old('tools_used', is_array($item->tools_used) ? implode(', ', $item->tools_used) : $item->tools_used) }}" required placeholder="Roblox Studio, Luau, Miro, Notion">
            @error('tools_used') <div class="error-msg">{{ $message }}</div> @enderror
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group">
                <label for="sort_order">Sort Order</label>
                <input type="number" id="sort_order" name="sort_order" value="{{ old('sort_order', $item->sort_order) }}" required>
                @error('sort_order') <div class="error-msg">{{ $message }}</div> @enderror
            </div>

            <div style="display: flex; gap: 16px; align-items: center; padding-top: 18px;">
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                    <input type="checkbox" name="is_featured" value="1" {{ old('is_featured', $item->is_featured) ? 'checked' : '' }} style="width: auto; margin-bottom: 0;">
                    <span>Feature on homepage</span>
                </label>
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                    <input type="checkbox" name="is_active" value="1" {{ old('is_active', $item->is_active) ? 'checked' : '' }} style="width: auto; margin-bottom: 0;">
                    <span>Published</span>
                </label>
            </div>
        </div>

        <div style="margin-top: 24px; display: flex; gap: 12px;">
            <button type="submit" class="btn btn-primary">Update Case Study</button>
            <a href="{{ route('admin.portfolio.index') }}" class="btn btn-secondary">Cancel</a>
        </div>
    </form>
</div>
@endsection
