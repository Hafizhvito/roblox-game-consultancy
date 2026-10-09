<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@example.com')],
            [
                'name'      => 'Admin',
                'email'     => env('ADMIN_EMAIL', 'admin@example.com'),
                'password'  => Hash::make(env('ADMIN_PASSWORD', 'changeme123!')),
                'is_admin'  => true,
            ]
        );
    }
}
