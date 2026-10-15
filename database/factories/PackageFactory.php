<?php

namespace Database\Factories;

use App\Models\Package;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PackageFactory extends Factory
{
    protected $model = Package::class;

    public function definition(): array
    {
        $name = fake()->unique()->word();
        return [
            'slug'           => Str::slug($name),
            'name'           => ucfirst($name),
            'tagline'        => fake()->sentence(),
            'price_idr_from' => fake()->randomElement([500000, 2500000, 5000000, 7500000]),
            'description'    => fake()->paragraph(),
            'features'       => [fake()->sentence(), fake()->sentence(), fake()->sentence()],
            'cta_label'      => 'Get started',
            'is_highlighted' => false,
            'sort_order'     => fake()->numberBetween(1, 10),
            'is_active'      => true,
        ];
    }
}
