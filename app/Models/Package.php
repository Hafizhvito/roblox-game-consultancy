<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug', 'name', 'tagline', 'price_idr_from',
        'description', 'features', 'cta_label', 'is_highlighted', 'sort_order', 'is_active',
    ];

    protected $casts = [
        'features'       => 'array',
        'is_highlighted' => 'boolean',
        'is_active'      => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }

    public function getFormattedPriceAttribute(): string
    {
        return 'Rp ' . number_format($this->price_idr_from, 0, ',', '.');
    }
}
