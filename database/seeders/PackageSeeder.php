<?php

namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
    public function run(): void
    {
        $packages = [
            [
                'slug'           => 'starter',
                'name'           => 'Starter',
                'tagline'        => 'A focused session to get unstuck.',
                'price_idr_from' => 500000,
                'description'    => 'Perfect if you need a second opinion, a quick audit, or help shaping one specific part of your project. One clearly scoped deliverable, fast turnaround.',
                'features'       => [
                    '1 scoped consulting session (60 min)',
                    'Short written summary and recommendations',
                    'One focused deliverable (single script review, one GDD section, or one UI screen audit)',
                    '1 day of async follow-up via email',
                ],
                'cta_label'      => 'Start here',
                'is_highlighted' => false,
                'sort_order'     => 1,
            ],
            [
                'slug'           => 'studio',
                'name'           => 'Studio',
                'tagline'        => 'Full consulting support for a project phase.',
                'price_idr_from' => 2500000,
                'description'    => 'For teams working through a complete project phase. Design, architecture, monetisation, or launch planning. We work alongside you until that phase is done.',
                'features'       => [
                    '2 consulting sessions (90 min each)',
                    'Deliverable set for one chosen service area',
                    'Architecture or economy review',
                    '1 week of async support',
                    'Written review at end of phase',
                ],
                'cta_label'      => 'Let\'s talk',
                'is_highlighted' => true,
                'sort_order'     => 2,
            ],
            [
                'slug'           => 'brand',
                'name'           => 'Brand',
                'tagline'        => 'End-to-end consulting for brands entering Roblox.',
                'price_idr_from' => 7500000,
                'description'    => 'Designed for brands who are new to Roblox and need a trusted partner to guide the whole journey: concept, development oversight, monetisation, and launch. Longer engagement, close collaboration.',
                'features'       => [
                    'Full game concept and design consulting',
                    'Development oversight and milestone reviews',
                    'Economy and monetisation planning',
                    'UI/UX system design',
                    'Launch and 90-day live-ops planning',
                    'Priority response, dedicated Notion workspace',
                    'Final price quoted after a scoping call',
                ],
                'cta_label'      => 'Book a discovery call',
                'is_highlighted' => false,
                'sort_order'     => 3,
            ],
        ];

        foreach ($packages as $package) {
            Package::updateOrCreate(['slug' => $package['slug']], $package);
        }
    }
}
