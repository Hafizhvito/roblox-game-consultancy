<?php

namespace Database\Factories;

use App\Models\Inquiry;
use Illuminate\Database\Eloquent\Factories\Factory;

class InquiryFactory extends Factory
{
    protected $model = Inquiry::class;

    public function definition(): array
    {
        return [
            'name'         => fake()->name(),
            'email'        => fake()->safeEmail(),
            'project_type' => fake()->randomElement(['game-concept', 'scripting', 'monetisation', 'ui-ux', 'launch']),
            'budget_range' => fake()->randomElement(['under-2m', '2m-5m', '5m-15m', 'over-15m']),
            'message'      => fake()->paragraph(),
            'status'       => 'new',
            'ip_address'   => fake()->ipv4(),
            'user_agent'   => fake()->userAgent(),
        ];
    }
}
