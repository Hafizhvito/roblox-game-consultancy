import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Section from '../../Components/Section';
import Badge from '../../Components/Badge';
import Button from '../../Components/Button';
import { IconArrowRight, IconCheck } from '../../Components/Icons';

export default function PortfolioShow({ item }) {
  const tools = Array.isArray(item.tools_used) ? item.tools_used : [];

  return (
    <AppLayout
      title={`${item.title}: Case Study`}
      description={item.summary}
    >
      {/* ── HEADER ── */}
      <section className="bg-cream border-b border-ink/10 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft hover:text-ink transition-colors"
            >
              &larr; Back to all case studies
            </Link>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge color={item.accent_color}>{item.category}</Badge>
              <span className="text-xs text-ink-soft font-mono">
                Client: {item.client}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink font-bold tracking-tight">
              {item.title}
            </h1>

            <p className="text-base sm:text-lg text-ink-soft leading-relaxed max-w-2xl">
              {item.summary}
            </p>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <Section background="white">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Problem */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#FFFBF8] border border-ink/10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-peach/40 border border-ink/15 text-xs font-bold uppercase tracking-wider text-ink">
              The Problem
            </div>
            <h2 className="font-display text-2xl text-ink font-semibold">
              What was holding this project back?
            </h2>
            <div className="text-sm sm:text-base text-ink leading-relaxed whitespace-pre-line">
              {item.problem}
            </div>
          </div>

          {/* Approach */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#F7FAF8] border border-ink/10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint/50 border border-ink/15 text-xs font-bold uppercase tracking-wider text-ink">
              Our Approach
            </div>
            <h2 className="font-display text-2xl text-ink font-semibold">
              How we structured the solution
            </h2>
            <div className="text-sm sm:text-base text-ink leading-relaxed whitespace-pre-line">
              {item.approach}
            </div>
          </div>

          {/* Outcome */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#FAF8FE] border border-ink/10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lavender/50 border border-ink/15 text-xs font-bold uppercase tracking-wider text-ink">
              The Outcome
            </div>
            <h2 className="font-display text-2xl text-ink font-semibold">
              Measurable improvements & deliverable results
            </h2>
            <div className="text-sm sm:text-base text-ink leading-relaxed whitespace-pre-line">
              {item.outcome}
            </div>
          </div>

          {/* Tools Used */}
          <div className="p-6 sm:p-8 rounded-2xl bg-cream border border-ink/10">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-soft mb-4">
              Tools & Software Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {tools.map((tool, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-ink/15 text-xs font-medium text-ink shadow-2xs"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="pt-8 border-t border-ink/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-xl text-ink font-semibold">
                Facing a similar obstacle in your game?
              </h3>
              <p className="text-xs text-ink-soft mt-1">
                We can run an exploratory audit on your place file or game design document.
              </p>
            </div>
            <Button href="/contact" variant="primary" size="lg">
              Start a Conversation
            </Button>
          </div>
        </div>
      </Section>
    </AppLayout>
  );
}
