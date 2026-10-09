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
                'price_idr_from' => 1500000,
                'description'    => 'Perfect if you need a second opinion, a quick audit, or help shaping one specific part of your project. One clearly scoped deliverable, fast turnaround.',
                'features'       => [
                    '1 scoped consulting session (90 min)',
                    'Written summary and recommendations',
                    'One deliverable of your choice (GDD section, code review, UI audit)',
                    '3 days of async follow-up via email',
                ],
                'cta_label'      => 'Start here',
                'is_highlighted' => false,
                'sort_order'     => 1,
            ],
            [
                'slug'           => 'studio',
                'name'           => 'Studio',
                'tagline'        => 'Full consulting support for a project phase.',
                'price_idr_from' => 5000000,
                'description'    => 'For teams working through a complete project phase. Design, architecture, monetisation, or launch planning. We work alongside you until that phase is done.',
                'features'       => [
                    '3 consulting sessions (90 min each)',
                    'Full deliverable set for chosen service area',
                    'Architecture or economy review',
                    '2 weeks of async support',
                    'Review call at end of phase',
                ],
                'cta_label'      => 'Let\'s talk',
                'is_highlighted' => true,
                'sort_order'     => 2,
            ],
            [
                'slug'           => 'brand',
                'name'           => 'Brand',
                'tagline'        => 'End-to-end consulting for brands entering Roblox.',
                'price_idr_from' => 15000000,
                'description'    => 'Designed for brands who are new to Roblox and need a trusted partner to guide the whole journey: concept, development oversight, monetisation, and launch. Longer engagement, close collaboration.',
                'features'       => [
                    'Full game concept and design consulting',
                    'Development oversight and milestone reviews',
                    'Economy and monetisation planning',
                    'UI/UX system design',
                    'Launch and 90-day live-ops planning',
                    'Priority response, dedicated Notion workspace',
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
