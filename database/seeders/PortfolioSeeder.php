<?php

namespace Database\Seeders;

use App\Models\PortfolioItem;
use Illuminate\Database\Seeder;

class PortfolioSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'slug'         => 'archipelago-quest',
                'title'        => 'Archipelago Quest',
                'client'       => 'Habibie (Archipelago Studio)',
                'category'     => 'Game Concept & Design',
                'accent_color' => 'mint',
                'summary'      => 'A tropical exploration game that needed a clearer progression system and a reason for players to come back after day one.',
                'problem'      => 'The team had a visually strong world but player retention at 7 days was 3.2%. The core loop lacked meaningful goals beyond exploration. Players had no incentive to return once they had seen the map.',
                'approach'     => 'We ran two design workshops to identify the motivational gap. The world was beautiful but passive. We introduced a collect-and-build progression layer, tying island discovery to a persistent trophy room visible to other players. We also redesigned the daily reward structure to reward return visits with story fragments rather than currency.',
                'outcome'      => '7-day retention improved to 8.6% within one month of the redesign shipping. The daily reward rework increased Day 1 to Day 2 retention by 5.4 percentage points. The game entered the Roblox discovery recommended section for the first time.',
                'tools_used'   => ['Miro', 'Notion', 'Google Sheets (economy modelling)', 'Roblox Studio'],
                'is_featured'  => true,
                'sort_order'   => 1,
            ],
            [
                'slug'         => 'code-fortress-review',
                'title'        => 'Code Fortress',
                'client'       => 'Rayhan (Fortress Games)',
                'category'     => 'Luau Architecture Review',
                'accent_color' => 'lavender',
                'summary'      => 'A tower defence game with ambitious mechanics that was slowing down badly at player counts above 12.',
                'problem'      => 'Performance degraded significantly beyond 12 concurrent players, causing rubberbanding and data loss on server shutdown. The codebase had grown organically across multiple developers with no shared conventions.',
                'approach'     => 'We performed a full architecture audit: server/client boundary analysis, RemoteEvent volume profiling, and a data store read/write pattern review. We identified three critical problem areas: unbounded remote flooding, synchronous DataStore calls in PlayerRemoving, and a missing object pooling system for projectiles.',
                'outcome'      => 'After implementing the recommended changes, the server handled 32 concurrent players without frame degradation. Data loss incidents dropped to zero within the first two weeks post-fix. The team adopted the coding conventions we outlined, reducing onboarding time for new contributors.',
                'tools_used'   => ['Roblox Studio Profiler', 'Luau', 'Miro', 'GitHub'],
                'is_featured'  => true,
                'sort_order'   => 2,
            ],
            [
                'slug'         => 'brand-worlds-launch',
                'title'        => 'Brand Worlds Launch',
                'client'       => 'Umam (Brand Experience Lab)',
                'category'     => 'Launch & Live-Ops Strategy',
                'accent_color' => 'peach',
                'summary'      => 'A consumer brand entering Roblox for the first time needed a launch plan that fit their marketing calendar and made sense for a Roblox audience.',
                'problem'      => 'The brand had an existing Roblox Studio build from an external agency but no go-to-market plan, no analytics setup, and no content roadmap. Launch was six weeks away.',
                'approach'     => 'We ran a rapid four-session engagement: analytics event mapping, launch week checklist creation, a 90-day content calendar, and a Roblox discoverability audit. We recommended three platform events to participate in and connected the team with two Roblox creators for a launch week activation.',
                'outcome'      => 'The game launched on schedule. Day 1 visits reached 42.500. The creator activation drove a second traffic spike at Day 3. The team had a functioning analytics dashboard on launch day for the first time.',
                'tools_used'   => ['Notion', 'Google Analytics for Firebase', 'Roblox Creator Hub', 'Figma'],
                'is_featured'  => false,
                'sort_order'   => 3,
            ],
        ];

        foreach ($items as $item) {
            PortfolioItem::updateOrCreate(['slug' => $item['slug']], $item);
        }
    }
}
