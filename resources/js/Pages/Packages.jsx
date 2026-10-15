import React, { useState } from 'react';
import AppLayout from '../Layouts/AppLayout';
import Section from '../Components/Section';
import Card from '../Components/Card';
import Badge from '../Components/Badge';
import Button from '../Components/Button';
import { IconCheck } from '../Components/Icons';

export default function Packages({ packages = [] }) {
  // 'IDR' | 'USD'
  const [currency, setCurrency] = useState('IDR');
  const USD_EXCHANGE_RATE = 15800;

  const formatIDR = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatUSD = (amountIDR) => {
    const usd = Math.round(amountIDR / USD_EXCHANGE_RATE);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(usd);
  };

  return (
    <AppLayout
      title="Packages & Pricing"
      description="Transparent consulting tiers for indie developers, established studios, and brands. Available in IDR and USD."
    >
      {/* ── HEADER ── */}
      <section className="bg-lavender/30 border-b border-ink/10 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-4">
              <Badge color="lavender">Clear Engagements</Badge>
              <h1 className="font-display text-4xl sm:text-5xl text-ink tracking-tight font-bold">
                Three tiers. Transparent global pricing.
              </h1>
              <p className="text-base sm:text-lg text-ink-soft leading-relaxed">
                Every package is fixed-scope with clear deliverables and async support. No surprise retainer fees, no platform jargon.
              </p>
            </div>

            {/* Currency Switcher Toggle */}
            <div className="bg-white p-1.5 rounded-2xl border border-ink/15 shadow-xs flex items-center gap-1 self-start md:self-auto">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft px-2.5">
                Currency:
              </span>
              <button
                type="button"
                onClick={() => setCurrency('IDR')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currency === 'IDR'
                    ? 'bg-ink text-cream shadow-xs'
                    : 'text-ink-soft hover:text-ink hover:bg-cream'
                }`}
              >
                🇮🇩 IDR (Rp)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currency === 'USD'
                    ? 'bg-ink text-cream shadow-xs'
                    : 'text-ink-soft hover:text-ink hover:bg-cream'
                }`}
              >
                🌐 USD ($)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING CARDS ── */}
      <Section background="cream">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg) => {
            const isHighlight = pkg.is_highlighted;
            const primaryPrice = currency === 'IDR' ? formatIDR(pkg.price_idr_from) : formatUSD(pkg.price_idr_from);
            const secondaryPrice = currency === 'IDR' ? `≈ ${formatUSD(pkg.price_idr_from)}` : `≈ ${formatIDR(pkg.price_idr_from)}`;

            return (
              <div
                key={pkg.id}
                className={`relative rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-200 ${
                  isHighlight
                    ? 'bg-white border-2 border-ink shadow-lg -translate-y-2'
                    : 'bg-white/80 border border-ink/15 shadow-xs'
                }`}
              >
                {isHighlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-3.5 py-1 rounded-full bg-butter text-ink text-[11px] font-bold uppercase tracking-wider border border-ink/20 shadow-2xs">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Tier Title & Tagline */}
                  <div>
                    <h2 className="font-display text-2xl text-ink font-semibold">
                      {pkg.name}
                    </h2>
                    <p className="text-xs text-ink-soft mt-1 min-h-[32px]">
                      {pkg.tagline}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="pb-6 border-b border-ink/10">
                    <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft block">
                      Starting from
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
                        {primaryPrice}
                      </span>
                    </div>
                    <span className="text-xs text-ink-soft mt-1 block font-mono">
                      {secondaryPrice} &middot; fixed scope
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-ink-soft leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-ink">
                      What is included
                    </span>
                    <ul className="space-y-3">
                      {Array.isArray(pkg.features) &&
                        pkg.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-3 text-xs sm:text-sm text-ink">
                            <span className="mt-0.5 w-4 h-4 rounded-full bg-mint flex items-center justify-center text-ink shrink-0 border border-ink/20">
                              <IconCheck className="w-2.5 h-2.5" />
                            </span>
                            <span>{feat}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-8 mt-8 border-t border-ink/10">
                  <Button
                    href={`/contact?package=${pkg.slug}`}
                    variant={isHighlight ? 'peach' : 'secondary'}
                    size="lg"
                    className="w-full"
                  >
                    {pkg.cta_label || 'Get in touch'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Assistant recommendation prompt */}
        <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-3">
          <span className="text-sm text-ink-soft">
            Not sure which package fits?
          </span>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(
                  new CustomEvent('open-chat', {
                    detail: { prefill: 'Which package fits my project?' },
                  })
                );
              }
            }}
          >
            Ask the assistant
          </Button>
        </div>
      </Section>

      {/* ── PLANNED MICRO-SAAS TOOLING: ECONOMY STUDIO PRO ── */}
      <Section background="cream">
        <div className="max-w-4xl mx-auto p-8 sm:p-12 rounded-3xl bg-white border-2 border-ink shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/10 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <Badge color="butter" size="sm">Planned In-House Software</Badge>
                <Badge color="peach" size="sm">Early Access</Badge>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl text-ink font-bold mt-2">
                Economy Studio PRO
              </h2>
              <p className="text-xs sm:text-sm text-ink-soft mt-1">
                A browser-based simulation suite for modeling progression curves, virtual item pricing, and sink-faucet balances.
              </p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft block">
                Target Subscription
              </span>
              <div className="font-display text-3xl font-bold text-ink mt-0.5">
                {currency === 'USD' ? '$29 / mo' : 'Rp 450.000 / bln'}
              </div>
              <span className="text-[11px] font-mono text-[#185e3a] font-semibold block">
                50% off for waitlist members
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-cream border border-ink/10 space-y-2">
              <h3 className="font-display text-sm font-bold text-ink">Multi-Item Modeling</h3>
              <p className="text-xs text-ink-soft leading-relaxed">
                Configure up to 20 gamepasses and developer products in a unified live simulation matrix.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-cream border border-ink/10 space-y-2">
              <h3 className="font-display text-sm font-bold text-ink">Sink & Faucet Telemetry</h3>
              <p className="text-xs text-ink-soft leading-relaxed">
                Test player currency inflation rates and retention choke points across 30-day simulation cycles.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-cream border border-ink/10 space-y-2">
              <h3 className="font-display text-sm font-bold text-ink">GDD Export Package</h3>
              <p className="text-xs text-ink-soft leading-relaxed">
                One-click export of structured game design specifications and balance sheets for your scripters.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-ink/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-ink-soft text-center sm:text-left">
              Independent simulation software. Not affiliated with or endorsed by Roblox Corporation.
            </span>
            <Button
              href="/calculator"
              variant="peach"
              size="md"
              className="w-full sm:w-auto"
            >
              Test Free Simulator & Join Waitlist &rarr;
            </Button>
          </div>
        </div>
      </Section>

      {/* ── FAQ / SCOPING EXPLANATION ── */}
      <Section background="mint-tint">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <Badge color="mint">Transparent Terms</Badge>
            <h2 className="font-display text-3xl text-ink font-semibold">
              Frequently asked questions about pricing
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-ink/10 space-y-2">
              <h3 className="font-display text-lg text-ink font-semibold">
                Can I pay in US Dollars (USD) or other international currencies?
              </h3>
              <p className="text-sm text-ink-soft leading-relaxed">
                Yes. While our base rates are anchored in Indonesian Rupiah (IDR), international clients can pay in USD via Wise, PayPal, or international wire transfer based on the prevailing exchange rate.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-ink/10 space-y-2">
              <h3 className="font-display text-lg text-ink font-semibold">
                What does "starting from" mean?
              </h3>
              <p className="text-sm text-ink-soft leading-relaxed">
                If your game has a standard codebase size and standard scope, you will pay the starting price. If your experience has 40+ microservices or complex external databases, we will quote a custom fixed scope after our initial discovery call before you commit to anything.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-ink/10 space-y-2">
              <h3 className="font-display text-lg text-ink font-semibold">
                How do payments and milestones work?
              </h3>
              <p className="text-sm text-ink-soft leading-relaxed">
                For Starter packages, full payment is due upon scheduling. For Studio and Brand engagements, payment is split into 50% upfront and 50% upon delivery of final documentation and walkthrough calls.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-ink/10 space-y-2">
              <h3 className="font-display text-lg text-ink font-semibold">
                Do you work on revenue share or Robux?
              </h3>
              <p className="text-sm text-ink-soft leading-relaxed">
                No. We work strictly on fixed-fee consulting to keep our incentives honest and aligned with your long-term success. We do not take game percentages or platform currency.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </AppLayout>
  );
}
