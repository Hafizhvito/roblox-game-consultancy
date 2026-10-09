<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug', 'title', 'tagline', 'description',
        'deliverables', 'suits', 'icon_key', 'sort_order', 'is_active',
    ];

    protected $casts = [
        'deliverables' => 'array',
        'is_active'    => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }
}
