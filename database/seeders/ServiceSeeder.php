<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'slug'        => 'game-concept-design',
                'title'       => 'Game Concept & Design',
                'tagline'     => 'From idea to a clear, buildable blueprint.',
                'description' => 'You have an idea, a theme, maybe a rough doc. We sit down together, stress-test it, and turn it into a game design document your team can actually build from. We look at core loop, player motivation, session length, progression, and how the concept fits Roblox culture without just copying what already exists.',
                'deliverables'=> [
                    'Game Design Document (GDD) draft',
                    'Core loop diagram',
                    'Feature priority list (MoSCoW)',
                    'Roblox platform fit assessment',
                    '60-minute review call',
                ],
                'suits'       => 'Indie creators with an idea but no structured plan, studios starting a new project, brands exploring Roblox for the first time.',
                'icon_key'    => 'IconConcept',
                'sort_order'  => 1,
            ],
            [
                'slug'        => 'luau-scripting-review',
                'title'       => 'Luau Scripting & Architecture',
                'tagline'     => 'Cleaner code, fewer bugs, easier updates.',
                'description' => 'We review your existing Luau codebase or help you design a solid architecture before you write a single line. This includes looking at server/client separation, RemoteEvent patterns, data store handling, and where the common performance traps hide.',
                'deliverables'=> [
                    'Written code review with annotated findings',
                    'Architecture diagram (Miro or PDF)',
                    'Prioritised list of refactors',
                    'Data store and RemoteEvent recommendations',
                    'Follow-up Q&A session',
                ],
                'suits'       => 'Developers who have shipped something but know the foundations are fragile, teams inheriting someone else\'s codebase.',
                'icon_key'    => 'IconCode',
                'sort_order'  => 2,
            ],
            [
                'slug'        => 'monetisation-economy',
                'title'       => 'Monetisation & Game Economy',
                'tagline'     => 'Revenue that feels fair and keeps players around.',
                'description' => 'We model your in-game economy, identify where players will spend or churn, and design a Robux monetisation approach that fits your game type. No dark patterns, no pay-to-win advice. Sustainable, player-friendly economies built for long-term retention.',
                'deliverables'=> [
                    'Economy balance spreadsheet',
                    'Monetisation model recommendation (cosmetics, passes, subscriptions)',
                    'Pricing benchmarks vs similar games',
                    'Retention touchpoints map',
                    'Implementation checklist',
                ],
                'suits'       => 'Games approaching soft launch, developers noticing low conversion or high churn.',
                'icon_key'    => 'IconEconomy',
                'sort_order'  => 3,
            ],
            [
                'slug'        => 'ui-ux-roblox',
                'title'       => 'UI/UX for Roblox Experiences',
                'tagline'     => 'Interfaces players understand without a tutorial.',
                'description' => 'Roblox UI has its own constraints: small screens, controller support, a young audience, and a platform that changes. We audit your existing UI or design new flows from scratch, focusing on clarity, visual hierarchy, and accessibility within ScreenGui.',
                'deliverables'=> [
                    'UI/UX audit report with heatmap annotations',
                    'Revised wireframes (Figma)',
                    'Component style guide for your UI team',
                    'Accessibility checklist for Roblox UI',
                    'Handover notes for your scripters',
                ],
                'suits'       => 'Games with working mechanics but confusing UI, studios wanting a consistent visual system.',
                'icon_key'    => 'IconUI',
                'sort_order'  => 4,
            ],
            [
                'slug'        => 'launch-liveops',
                'title'       => 'Launch & Live-Ops Strategy',
                'tagline'     => 'A plan for launch week and the months after.',
                'description' => 'Shipping is the easy part. Keeping players is the work. We help you plan a realistic launch roadmap, identify your first content update, set up your analytics baselines, and write a live-ops calendar for the first three months. We also look at discoverability: Roblox SEO, event participation, and creator partnerships.',
                'deliverables'=> [
                    'Launch week checklist',
                    '90-day live-ops calendar template',
                    'Analytics events list (what to track and why)',
                    'Discoverability recommendations',
                    'Post-launch review call at 30 days',
                ],
                'suits'       => 'Games in final polish, studios with a solid game but no marketing or retention plan.',
                'icon_key'    => 'IconLaunch',
                'sort_order'  => 5,
            ],
        ];

        foreach ($services as $service) {
            Service::updateOrCreate(['slug' => $service['slug']], $service);
        }
    }
}
