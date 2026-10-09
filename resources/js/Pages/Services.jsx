import React from 'react';
import AppLayout from '../Layouts/AppLayout';
import Section from '../Components/Section';
import Card from '../Components/Card';
import Badge from '../Components/Badge';
import Button from '../Components/Button';
import { ServiceIcon, IconCheck, IconArrowRight } from '../Components/Icons';

export default function Services({ services = [] }) {
  return (
    <AppLayout
      title="Services"
      description="Game concept design, Luau scripting review, economy balance, Roblox UI/UX, and launch strategy."
    >
      {/* ── HEADER ── */}
      <section className="bg-peach/30 border-b border-ink/10 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <Badge color="peach">Consulting Catalog</Badge>
            <h1 className="font-display text-4xl sm:text-5xl text-ink tracking-tight">
              Services tailored to Roblox platform realities.
            </h1>
            <p className="text-base sm:text-lg text-ink-soft leading-relaxed">
              We work directly on your files, models, and game design documents. Here is what we deliver, who it is built for, and how each engagement unfolds.
            </p>
          </div>
        </div>
      </section>

      {/* ── SERVICE DETAILS ── */}
      <Section background="cream">
        <div className="space-y-16">
          {services.map((service, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={service.id}
                id={service.slug}
                className="scroll-mt-24 p-8 sm:p-10 md:p-12 rounded-3xl bg-white border border-ink/10 shadow-xs space-y-8"
              >
                {/* Header row */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-ink/10">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-peach/50 border border-ink/20 flex items-center justify-center text-ink shrink-0">
                      <ServiceIcon name={service.icon_key} className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-ink-soft">
                        Service 0{index + 1}
                      </span>
                      <h2 className="font-display text-2xl sm:text-3xl text-ink font-semibold">
                        {service.title}
                      </h2>
                      <p className="text-sm font-medium text-ink-soft mt-1">
                        {service.tagline}
                      </p>
                    </div>
                  </div>

                  <Button href={`/contact?service=${service.slug}`} variant="primary" size="md">
                    Inquire about this
                  </Button>
                </div>

                {/* Content grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left: Description & Audience */}
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-soft mb-2">
                        What you get
                      </h3>
                      <p className="text-sm sm:text-base text-ink leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <div className="bg-cream p-5 rounded-2xl border border-ink/10 space-y-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                        Who it suits best
                      </h4>
                      <p className="text-sm text-ink leading-relaxed">
                        {service.suits}
                      </p>
                    </div>
                  </div>

                  {/* Right: Deliverables List */}
                  <div className="lg:col-span-5 bg-mint/20 p-6 sm:p-8 rounded-2xl border border-ink/10 space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-ink">
                      Typical Deliverables
                    </h3>
                    <ul className="space-y-3">
                      {Array.isArray(service.deliverables) &&
                        service.deliverables.map((item, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-3 text-xs sm:text-sm text-ink">
                            <span className="mt-0.5 w-4 h-4 rounded-full bg-mint flex items-center justify-center text-ink shrink-0 border border-ink/20">
                              <IconCheck className="w-2.5 h-2.5" />
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── NOT SURE SECTION ── */}
      <Section background="butter-tint">
        <div className="text-center max-w-xl mx-auto space-y-6">
          <Badge color="butter">Need Guidance?</Badge>
          <h2 className="font-display text-3xl text-ink">
            Not sure which service matches your current stage?
          </h2>
          <p className="text-sm text-ink-soft leading-relaxed">
            Send us a quick note describing where your game is right now: a rough sketch, an unoptimized place file, or a soft-launched experience. We will advise you on the most cost-effective path forward.
          </p>
          <Button href="/contact" variant="primary" size="lg">
            Tell Us About Your Project
          </Button>
        </div>
      </Section>
    </AppLayout>
  );
}
