import React from 'react';
import AppLayout from '../Layouts/AppLayout';
import Section from '../Components/Section';
import Badge from '../Components/Badge';
import Button from '../Components/Button';
import { IconCheck } from '../Components/Icons';
import { StudioCompass } from '../Components/Motifs';

export default function Process() {
  const phases = [
    {
      num: '01',
      title: 'Consultation & Discovery',
      timeline: '1 to 2 business days',
      accent: 'peach',
      summary: 'We get on a structured 60-to-90 minute video call to review your current Roblox game build, pitch deck, or concept outline.',
      whatWeDo: [
        'Review current analytics, retention trends, and player feedback',
        'Identify immediate bottlenecks in architecture, core loops, or monetisation',
        'Clarify your target audience and launch deadlines',
      ],
      whatWeNeed: [
        'Place file access, uncopylocked testing link, or design doc',
        'Summary of your current team setup and scripter capacity',
      ],
    },
    {
      num: '02',
      title: 'Scoping & Alignment',
      timeline: '2 to 3 business days',
      accent: 'mint',
      summary: 'We deliver a crisp written proposal specifying deliverables, milestones, fixed IDR pricing, and realistic delivery dates.',
      whatWeDo: [
        'Define exact deliverable formats (spreadsheets, Figma wireframes, or annotated code)',
        'Set up communication channels and shared review documents',
        'Establish milestone checkpoints and feedback deadlines',
      ],
      whatWeNeed: [
        'Approval on the project scope document',
        'Initial deposit or invoice sign-off',
      ],
    },
    {
      num: '03',
      title: 'Hands-on Execution',
      timeline: '1 to 3 weeks (based on tier)',
      accent: 'lavender',
      summary: 'We roll up our sleeves and perform the detailed work directly in Roblox Studio, code profilers, or economy balance models.',
      whatWeDo: [
        'In-depth Luau code refactoring recommendations with test scripts',
        'Balancing simulations for progression pacing and Robux economy sinks',
        'Component-level UI/UX wireframes with controller and mobile scaling rules',
      ],
      whatWeNeed: [
        'Timely responses to clarifying technical questions via Discord or email',
        'Access to test environment builds when validating performance fixes',
      ],
    },
    {
      num: '04',
      title: 'Handover & Walkthrough',
      timeline: '3 to 5 business days',
      accent: 'butter',
      summary: 'We walk your development team through every document and recommendation, ensuring you can implement with full independence.',
      whatWeDo: [
        'Live walkthrough video call with full Q&A for your scripters and builders',
        'Clean Notion workspace or exportable PDF documentation package',
        'Async follow-up window (3 to 14 days) to answer questions during implementation',
      ],
      whatWeNeed: [
        'Team attendance during the final handover call',
        'Sign-off on deliverable completion',
      ],
    },
  ];

  return (
    <AppLayout
      title="How We Work: Consultation Process"
      description="Four disciplined phases: consultation, scoping, execution, and handover with realistic timelines."
    >
      {/* ── HEADER ── */}
      <section className="bg-mint/30 border-b border-ink/10 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <Badge color="mint">Clear Methodology</Badge>
            <h1 className="font-display text-4xl sm:text-5xl text-ink tracking-tight">
              A predictable process with realistic timelines.
            </h1>
            <p className="text-base sm:text-lg text-ink-soft leading-relaxed">
              Game development is already full of unexpected platform changes. Our consulting process is deliberately structured so you always know what comes next.
            </p>
          </div>
        </div>
      </section>

      {/* ── TIMELINE PHASES ── */}
      <Section background="cream">
        <div className="space-y-12">
          {phases.map((phase) => (
            <div
              key={phase.num}
              className="p-8 sm:p-10 md:p-12 rounded-3xl bg-white border border-ink/10 shadow-xs space-y-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ink/10">
                <div className="flex items-center gap-4">
                  <span className="w-12 h-12 rounded-2xl bg-ink text-cream font-mono font-bold text-lg flex items-center justify-center shrink-0">
                    {phase.num}
                  </span>
                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl text-ink font-semibold">
                      {phase.title}
                    </h2>
                    <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft mt-0.5 block">
                      Typical Timeline: {phase.timeline}
                    </span>
                  </div>
                </div>

                <Badge color={phase.accent} size="md">
                  Phase {phase.num}
                </Badge>
              </div>

              <p className="text-base text-ink leading-relaxed">
                {phase.summary}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                {/* What we do */}
                <div className="p-6 rounded-2xl bg-cream border border-ink/10 space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-ink">
                    What we do during this phase
                  </h3>
                  <ul className="space-y-2.5">
                    {phase.whatWeDo.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink-soft">
                        <span className="mt-1 w-2 h-2 rounded-full bg-ink shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What we need */}
                <div className="p-6 rounded-2xl bg-[#FAF8FE] border border-ink/10 space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-ink">
                    What we need from your side
                  </h3>
                  <ul className="space-y-2.5">
                    {phase.whatWeNeed.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink-soft">
                        <span className="mt-1 w-2 h-2 rounded-full bg-lavender shrink-0 border border-ink/20" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── CALL TO ACTION ── */}
      <Section background="peach-tint">
        <div className="text-center max-w-xl mx-auto space-y-6">
          <Badge color="peach">Ready for Step 01?</Badge>
          <h2 className="font-display text-3xl text-ink">
            Book an initial consultation to get started.
          </h2>
          <p className="text-sm text-ink-soft leading-relaxed">
            Fill out our inquiry form with your game link or current documentation. We review every submission within two business days.
          </p>
          <Button href="/contact" variant="primary" size="lg">
            Schedule Phase 01
          </Button>
        </div>
      </Section>
    </AppLayout>
  );
}
