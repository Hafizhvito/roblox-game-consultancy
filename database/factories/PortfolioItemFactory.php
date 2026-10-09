<?php

namespace Database\Factories;

use App\Models\PortfolioItem;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PortfolioItemFactory extends Factory
{
    protected $model = PortfolioItem::class;

    public function definition(): array
    {
        $title = fake()->unique()->words(3, true);
        return [
            'slug'         => Str::slug($title),
            'title'        => ucfirst($title),
            'client'       => '[CLIENT_NAME]',
            'category'     => fake()->randomElement(['Game Concept & Design', 'Luau Architecture', 'Monetisation Review', 'UI/UX Redesign']),
            'accent_color' => fake()->randomElement(['peach', 'mint', 'lavender', 'butter', 'sky']),
            'summary'      => fake()->paragraph(),
            'problem'      => fake()->paragraph(),
            'approach'     => fake()->paragraph(),
            'outcome'      => 'Day 7 retention increased to [PROJECT_RESULT]%.',
            'tools_used'   => ['Roblox Studio', 'Luau', 'Miro'],
            'is_featured'  => false,
            'sort_order'   => fake()->numberBetween(1, 10),
            'is_active'    => true,
        ];
    }
}
