import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Section from '../../Components/Section';
import Card from '../../Components/Card';
import Badge from '../../Components/Badge';
import Button from '../../Components/Button';
import { IconArrowRight } from '../../Components/Icons';

export default function PortfolioIndex({ items = [] }) {
  return (
    <AppLayout
      title="Portfolio & Case Studies"
      description="Detailed case studies covering Roblox game design, Luau architecture, economy modeling, and launch strategies."
    >
      {/* ── HEADER ── */}
      <section className="bg-sky/30 border-b border-ink/10 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <Badge color="sky">Real Problem Solving</Badge>
            <h1 className="font-display text-4xl sm:text-5xl text-ink tracking-tight">
              Case studies and project breakdowns.
            </h1>
            <p className="text-base sm:text-lg text-ink-soft leading-relaxed">
              Every project comes with distinct constraints: network latency, player onboarding friction, or fragile codebases. Here is how we tackled each challenge.
            </p>
          </div>
        </div>
      </section>

      {/* ── CASE STUDY LIST ── */}
      <Section background="cream">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <Card
              key={item.id}
              accent={item.accent_color}
              className="flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-ink-soft">
                    {item.category}
                  </span>
                  {item.is_featured && (
                    <Badge color="butter" size="sm">Featured</Badge>
                  )}
                </div>

                <h2 className="font-display text-2xl text-ink font-semibold">
                  {item.title}
                </h2>

                <p className="text-xs text-ink-soft font-medium">
                  Client: {item.client}
                </p>

                <p className="text-sm text-ink-soft leading-relaxed line-clamp-4">
                  {item.summary}
                </p>
              </div>

              <div className="pt-6 border-t border-ink/10 mt-6">
                <Link
                  href={`/portfolio/${item.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-ink hover:underline group"
                >
                  <span>Read full case study</span>
                  <IconArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── CTA ── */}
      <Section background="mint-tint">
        <div className="text-center max-w-xl mx-auto space-y-6">
          <Badge color="mint">Similar Challenges?</Badge>
          <h2 className="font-display text-3xl text-ink">
            Have a game encountering similar architectural or retention issues?
          </h2>
          <p className="text-sm text-ink-soft leading-relaxed">
            We will conduct an initial review call to identify whether a code audit or game loop rework will have the highest impact on your metrics.
          </p>
          <Button href="/contact" variant="primary" size="lg">
            Discuss Your Game
          </Button>
        </div>
      </Section>
    </AppLayout>
  );
}
