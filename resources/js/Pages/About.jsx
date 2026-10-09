import React from 'react';
import AppLayout from '../Layouts/AppLayout';
import Section from '../Components/Section';
import Card from '../Components/Card';
import Badge from '../Components/Badge';
import Button from '../Components/Button';
import { StudioCompass, GeometricStairs } from '../Components/Motifs';

export default function About() {
  const tools = [
    {
      name: 'Roblox Studio & Profiler',
      category: 'Engine & Diagnostics',
      desc: 'Used daily for microprofiling frame times, memory usage by tag, physics stress tests, and network replication inspection.',
    },
    {
      name: 'Rojo & VS Code',
      category: 'Development Workflow',
      desc: 'Enables modern version-controlled Git workflows for Luau development, modular file structures, and automated linting.',
    },
    {
      name: 'Luau Strict Type Checking',
      category: 'Language & Architecture',
      desc: 'Enforcing type safety across client-server networking boundaries to prevent runtime crashes and silent data corruption.',
    },
    {
      name: 'Miro & FigJam',
      category: 'Systems & Game Loops',
      desc: 'Visualising progression trees, state machines, inventory flows, and player onboarding pathways before writing code.',
    },
    {
      name: 'Google Sheets (Economy Models)',
      category: 'Economy Balance',
      desc: 'Mathematical formulas modeling grind curves, currency generation rates, Robux pass pricing, and cosmetic sinks.',
    },
    {
      name: 'Figma',
      category: 'UI/UX Design',
      desc: 'High-fidelity wireframes mapped directly to Roblox ScreenGui scale and offset constraints, controller navigation, and touch bounds.',
    },
  ];

  const values = [
    {
      title: 'Craft over Hype',
      desc: 'We do not sell guaranteed front-page rankings or get-rich-quick game templates. We build sustainable games with clean code and healthy retention loops.',
      accent: 'mint',
    },
    {
      title: 'Player-First Monetisation',
      desc: 'Roblox players are perceptive. Predatory loot boxes and deceptive paywalls cause high churn. We design economies players happily support for months.',
      accent: 'peach',
    },
    {
      title: 'Empowering Your Team',
      desc: 'We deliver clear documentation and walkthrough sessions so your in-house developers understand every architectural choice long after our contract ends.',
      accent: 'lavender',
    },
  ];

  return (
    <AppLayout
      title="About the Studio"
      description="Who is behind the consultancy, our philosophy on Roblox experience design, and the tools we use."
    >
      {/* ── HEADER ── */}
      <section className="bg-butter/30 border-b border-ink/10 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <Badge color="butter">About the Studio</Badge>
            <h1 className="font-display text-4xl sm:text-5xl text-ink tracking-tight">
              Independent advisory with deep engine knowledge.
            </h1>
            <p className="text-base sm:text-lg text-ink-soft leading-relaxed">
              We are a dedicated consultancy helping indie creators, small studios, and brands understand the nuances of building on Roblox.
            </p>
          </div>
        </div>
      </section>

      {/* ── BACKGROUND & STORY ── */}
      <Section background="cream">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-display text-3xl sm:text-4xl text-ink tracking-tight">
              Why we started this advisory practice
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-ink-soft leading-relaxed">
              <p>
                Founded by Hafizh Vito and Rainer in Indonesia, this practice was started to bring disciplined software engineering practices, robust game design methodology, and transparent financial modeling into the Roblox creator ecosystem.
              </p>
              <p>
                Roblox has evolved into a complex distributed engine with millions of daily players. Yet many creator teams still struggle with the exact same traps: monolithic spaghetti code, unhandled server shutdowns causing DataStore loss, game economies that inflate out of control, and UI systems that break on mobile devices.
              </p>
              <p>
                We do not operate as an outsourced agency that disappears after shipping an unmaintainable codebase. Instead, we work alongside your core team: reviewing code, designing retention loops, and auditing launch roadmaps with clear written deliverables.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="p-8 bg-white rounded-3xl border border-ink/10 shadow-xs max-w-sm w-full space-y-6 text-center">
              <div className="flex justify-center">
                <StudioCompass className="w-24 h-24" />
              </div>
              <div>
                <span className="font-display text-xl text-ink font-semibold block">
                  Studio Principles
                </span>
                <span className="text-xs text-ink-soft mt-1 block">
                  Focused on clarity and long-term maintainability
                </span>
              </div>
              <div className="pt-4 border-t border-ink/10 text-left text-xs text-ink-soft space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-ink" />
                  <span>Founders: Hafizh Vito & Rainer</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-ink" />
                  <span>Based in Indonesia, serving global studios</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-ink" />
                  <span>Strict adherence to Roblox Platform Terms</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-ink" />
                  <span>Complete confidentiality via mutual NDA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── VALUES ── */}
      <Section background="lavender-tint">
        <div className="text-center max-w-xl mx-auto mb-12">
          <Badge color="lavender" className="mb-3">Our Values</Badge>
          <h2 className="font-display text-3xl sm:text-4xl text-ink tracking-tight">
            How we approach game design
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((val, idx) => (
            <Card key={idx} accent={val.accent} className="space-y-4">
              <Badge color={val.accent} size="sm">Value 0{idx + 1}</Badge>
              <h3 className="font-display text-xl text-ink font-semibold">
                {val.title}
              </h3>
              <p className="text-sm text-ink-soft leading-relaxed">
                {val.desc}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── TOOLS WE USE ── */}
      <Section background="cream">
        <div className="max-w-xl mb-12">
          <Badge color="peach" className="mb-3">Engine & Stack</Badge>
          <h2 className="font-display text-3xl sm:text-4xl text-ink tracking-tight">
            Tools we work with every day
          </h2>
          <p className="text-sm text-ink-soft mt-2">
            No proprietary black boxes. We work directly with standard industry software and modern Luau tooling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((t, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-ink/10 space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                {t.category}
              </span>
              <h3 className="font-display text-lg text-ink font-semibold">
                {t.name}
              </h3>
              <p className="text-xs text-ink-soft leading-relaxed">
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── CTA ── */}
      <Section background="white">
        <div className="text-center max-w-xl mx-auto space-y-6">
          <h2 className="font-display text-3xl text-ink">
            Want to see how we can assist your project?
          </h2>
          <p className="text-sm text-ink-soft leading-relaxed">
            Reach out with your questions or pitch deck. We are always glad to connect with fellow developers.
          </p>
          <Button href="/contact" variant="primary" size="lg">
            Say Hello
          </Button>
        </div>
      </Section>
    </AppLayout>
  );
}
