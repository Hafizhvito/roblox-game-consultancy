<?php

namespace Database\Factories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ServiceFactory extends Factory
{
    protected $model = Service::class;

    public function definition(): array
    {
        $title = fake()->unique()->words(3, true);
        return [
            'slug'         => Str::slug($title),
            'title'        => ucfirst($title),
            'tagline'      => fake()->sentence(),
            'description'  => fake()->paragraph(),
            'deliverables' => [fake()->sentence(), fake()->sentence(), fake()->sentence()],
            'suits'        => fake()->sentence(),
            'icon_key'     => 'IconConcept',
            'sort_order'   => fake()->numberBetween(1, 10),
            'is_active'    => true,
        ];
    }
}
