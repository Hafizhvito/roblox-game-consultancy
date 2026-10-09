<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PortfolioItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug', 'title', 'client', 'category', 'accent_color',
        'summary', 'problem', 'approach', 'outcome',
        'tools_used', 'is_featured', 'sort_order', 'is_active',
    ];

    protected $casts = [
        'tools_used'  => 'array',
        'is_featured' => 'boolean',
        'is_active'   => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }
}
