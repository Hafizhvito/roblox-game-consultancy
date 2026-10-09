import React, { useState } from 'react';
import AppLayout from '../Layouts/AppLayout';
import Section from '../Components/Section';
import Card from '../Components/Card';
import Badge from '../Components/Badge';
import Button from '../Components/Button';
import Modal from '../Components/Modal';
import { IconCheck, IconArrowRight } from '../Components/Icons';

export default function Calculator() {
  // Mode: 'gamepass' | 'devex' | 'pro'
  const [activeTab, setActiveTab] = useState('gamepass');

  // Gamepass Calculator State
  const [gamepassPrice, setGamepassPrice] = useState(250);
  const [buyersPerMonth, setBuyersPerMonth] = useState(150);

  // DevEx Calculator State
  const [devexRobux, setDevexRobux] = useState(50000);
  const [exchangeRate, setExchangeRate] = useState(15800); // USD to IDR benchmark

  // Pro Preview Table Currency Toggle: 'USD' | 'IDR'
  const [proCurrency, setProCurrency] = useState('USD');

  // Early Access Waitlist State
  const [showProModal, setShowProModal] = useState(false);
  const [proEmail, setProEmail] = useState('');
  const [proName, setProName] = useState('');
  const [proDiscord, setProDiscord] = useState('');
  const [proSubmitting, setProSubmitting] = useState(false);
  const [proSuccess, setProSuccess] = useState(false);
  const [proError, setProError] = useState('');

  // Official Roblox Constants
  // Source: Roblox Creator Hub Developer Exchange documentation (verified October 2026)
  const ROBLOX_TAX_RATE = 0.30;
  const DEVEX_RATE_PER_ROBUX = 0.0035; // $0.0035 per 1 earned Robux
  const MIN_DEVEX_THRESHOLD = 30000;   // 30,000 earned Robux minimum cashout threshold

  // Gamepass Calculations
  const taxRobux = Math.floor(gamepassPrice * ROBLOX_TAX_RATE);
  const netRobuxPerSale = gamepassPrice - taxRobux;
  const totalGrossMonthly = gamepassPrice * buyersPerMonth;
  const totalNetMonthly = netRobuxPerSale * buyersPerMonth;
  const totalNetMonthlyUSD = totalNetMonthly * DEVEX_RATE_PER_ROBUX;
  const totalNetMonthlyIDR = totalNetMonthlyUSD * exchangeRate;

  // DevEx Calculations
  const isEligibleDevEx = devexRobux >= MIN_DEVEX_THRESHOLD;
  const devexUSD = devexRobux * DEVEX_RATE_PER_ROBUX;
  const devexIDR = devexUSD * exchangeRate;

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatUSD = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    setProSubmitting(true);
    setProError('');
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const res = await fetch('/early-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken || '',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: proEmail,
          name: proName,
          discord: proDiscord,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setProSuccess(true);
      } else {
        setProError(data.message || 'Failed to submit. Please ensure your email is formatted correctly.');
      }
    } catch (err) {
      setProError('Connection lost. Please try again.');
    } finally {
      setProSubmitting(false);
    }
  };

  // Pro Preview Table Sample Items
  const proSampleItems = [
    {
      name: 'VIP Founder Pass',
      priceRobux: 450,
      monthlySales: 120,
      taxRobux: 16200,
      netRobux: 37800,
      usdValue: 37800 * DEVEX_RATE_PER_ROBUX,
    },
    {
      name: '2x Speed Potion (Permanent)',
      priceRobux: 150,
      monthlySales: 340,
      taxRobux: 15300,
      netRobux: 35700,
      usdValue: 35700 * DEVEX_RATE_PER_ROBUX,
    },
    {
      name: 'Auto-Collect Magnet',
      priceRobux: 250,
      monthlySales: 210,
      taxRobux: 15750,
      netRobux: 36750,
      usdValue: 36750 * DEVEX_RATE_PER_ROBUX,
    },
    {
      name: 'Skip Hard Stage (Developer Product)',
      priceRobux: 50,
      monthlySales: 680,
      taxRobux: 10200,
      netRobux: 23800,
      usdValue: 23800 * DEVEX_RATE_PER_ROBUX,
    },
  ];

  const proTotalSales = proSampleItems.reduce((acc, i) => acc + i.monthlySales, 0);
  const proTotalTax = proSampleItems.reduce((acc, i) => acc + i.taxRobux, 0);
  const proTotalNetRobux = proSampleItems.reduce((acc, i) => acc + i.netRobux, 0);
  const proTotalUSD = proSampleItems.reduce((acc, i) => acc + i.usdValue, 0);
  const proTotalIDR = proTotalUSD * exchangeRate;

  return (
    <AppLayout
      title="Robux Marketplace Fee & DevEx Calculator"
      description="Calculate Roblox 30% marketplace fees on gamepasses and developer products, simulate net creator earnings, and estimate real cashout value through Developer Exchange (DevEx)."
    >
      {/* ── HEADER ── */}
      <section className="bg-peach/30 border-b border-ink/10 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <Badge color="peach">Free Creator Tool</Badge>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink tracking-tight font-bold">
              Robux Marketplace Fee & DevEx Cashout Calculator
            </h1>
            <p className="text-sm sm:text-base text-ink-soft leading-relaxed">
              Calculate Roblox 30% marketplace fees on gamepasses and developer products, simulate net creator earnings, and estimate real cashout value through Developer Exchange (DevEx).
            </p>
          </div>
        </div>
      </section>

      {/* ── MAIN INTERACTIVE TOOL ── */}
      <Section background="cream">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Navigation Tabs */}
          <div className="flex border-b border-ink/15 gap-4 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setActiveTab('gamepass')}
              className={`pb-3 text-sm sm:text-base font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'gamepass'
                  ? 'border-ink text-ink'
                  : 'border-transparent text-ink-soft hover:text-ink'
              }`}
            >
              <span>1. Gamepass Marketplace Cut (30%)</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-mint text-ink font-mono">Free</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('devex')}
              className={`pb-3 text-sm sm:text-base font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'devex'
                  ? 'border-ink text-ink'
                  : 'border-transparent text-ink-soft hover:text-ink'
              }`}
            >
              <span>2. DevEx Cashout Simulator</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-butter text-ink font-mono">Free</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pro')}
              className={`pb-3 text-sm sm:text-base font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'pro'
                  ? 'border-ink text-ink font-bold'
                  : 'border-transparent text-ink-soft hover:text-ink'
              }`}
            >
              <span>3. Economy Studio PRO</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-peach text-ink font-bold font-mono">Early Access</span>
            </button>
          </div>

          {/* TAB 1: GAMEPASS CALCULATOR */}
          {activeTab === 'gamepass' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-rise">
              {/* Controls Column */}
              <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white border border-ink/10 shadow-xs space-y-6">
                <div>
                  <h2 className="font-display text-xl text-ink font-semibold">
                    Set Sales Parameters
                  </h2>
                  <p className="text-xs text-ink-soft mt-1">
                    Enter your item price and projected transaction volume.
                  </p>
                </div>

                {/* Price Input */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <label htmlFor="gp-price" className="font-semibold text-ink uppercase tracking-wider">
                      Gamepass Price (Robux)
                    </label>
                    <span className="font-mono font-bold text-ink bg-peach/40 px-2.5 py-1 rounded-lg">
                      {formatNumber(gamepassPrice)} R$
                    </span>
                  </div>
                  <input
                    id="gp-price"
                    type="range"
                    min="10"
                    max="5000"
                    step="10"
                    value={gamepassPrice}
                    onChange={(e) => setGamepassPrice(Number(e.target.value))}
                    className="w-full accent-ink cursor-pointer"
                  />
                  <div className="flex flex-wrap gap-2">
                    {[50, 100, 250, 500, 1000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setGamepassPrice(preset)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          gamepassPrice === preset
                            ? 'bg-ink text-cream border-ink font-bold'
                            : 'bg-cream text-ink border-ink/20 hover:border-ink/40'
                        }`}
                      >
                        {preset} R$
                      </button>
                    ))}
                  </div>
                </div>

                {/* Monthly Volume Input */}
                <div className="space-y-3 pt-4 border-t border-ink/10">
                  <div className="flex justify-between items-center text-xs">
                    <label htmlFor="gp-buyers" className="font-semibold text-ink uppercase tracking-wider">
                      Estimated Monthly Buyers
                    </label>
                    <span className="font-mono font-bold text-ink bg-mint/50 px-2.5 py-1 rounded-lg">
                      {formatNumber(buyersPerMonth)} buyers
                    </span>
                  </div>
                  <input
                    id="gp-buyers"
                    type="range"
                    min="5"
                    max="2000"
                    step="5"
                    value={buyersPerMonth}
                    onChange={(e) => setBuyersPerMonth(Number(e.target.value))}
                    className="w-full accent-ink cursor-pointer"
                  />
                </div>

                {/* USD to IDR Benchmark */}
                <div className="pt-4 border-t border-ink/10 flex items-center justify-between text-xs text-ink-soft">
                  <span>USD to IDR Benchmark Rate</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span>Rp</span>
                    <input
                      type="number"
                      value={exchangeRate}
                      onChange={(e) => setExchangeRate(Number(e.target.value))}
                      className="w-24 px-2 py-1 text-xs border rounded-lg bg-cream font-bold text-ink"
                    />
                  </div>
                </div>
              </div>

              {/* Results Breakdown Column */}
              <div className="lg:col-span-6 space-y-6">
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-ink/10 shadow-xs space-y-6">
                  <h3 className="font-display text-xl text-ink font-semibold">
                    Per-Transaction Revenue Split
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[#FFF7F4] border border-ink/10 space-y-1">
                      <span className="text-[11px] font-semibold text-ink-soft uppercase tracking-wider block">
                        Roblox Cut (30%)
                      </span>
                      <span className="text-xl font-bold font-mono text-ink">
                        -{taxRobux} R$
                      </span>
                      <span className="text-[11px] text-ink-soft block">
                        Platform marketplace fee
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#F2FAF6] border border-ink/10 space-y-1">
                      <span className="text-[11px] font-semibold text-ink-soft uppercase tracking-wider block">
                        Net Creator Share (70%)
                      </span>
                      <span className="text-xl font-bold font-mono text-ink text-[#185e3a]">
                        +{netRobuxPerSale} R$
                      </span>
                      <span className="text-[11px] text-ink-soft block">
                        Credited to developer balance
                      </span>
                    </div>
                  </div>

                  {/* Monthly Projection */}
                  <div className="p-6 rounded-2xl bg-cream border border-ink/10 space-y-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-ink block">
                      Monthly Revenue Projection ({buyersPerMonth} sales)
                    </span>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-ink-soft">
                        <span>Total Net Robux:</span>
                        <span className="font-mono font-bold text-ink">{formatNumber(totalNetMonthly)} R$</span>
                      </div>
                      <div className="flex justify-between text-xs text-ink-soft">
                        <span>Estimated DevEx Value (USD):</span>
                        <span className="font-mono font-bold text-ink">{formatUSD(totalNetMonthlyUSD)}</span>
                      </div>
                      <div className="flex justify-between items-baseline pt-2 border-t border-ink/10">
                        <span className="text-sm font-semibold text-ink">Estimated Value in IDR:</span>
                        <span className="font-display text-2xl font-bold text-ink">
                          {formatIDR(totalNetMonthlyIDR)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consultation Advisory Box */}
                <div className="p-6 rounded-2xl bg-peach/40 border border-ink/15 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-ink uppercase tracking-wider">
                      Game Economy Advisory
                    </span>
                  </div>
                  <p className="text-xs text-ink leading-relaxed">
                    Pricing gamepasses requires careful calibration. Overpriced passes trigger friction and player churn, while underpriced items deplete your game progression loop prematurely.
                  </p>
                  <Button href="/contact?service=monetisation-economy" variant="primary" size="sm">
                    Review Your Game Economy With Us &rarr;
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DEVEX SIMULATOR */}
          {activeTab === 'devex' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-rise">
              {/* Controls Column */}
              <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white border border-ink/10 shadow-xs space-y-6">
                <div>
                  <h2 className="font-display text-xl text-ink font-semibold">
                    Developer Exchange (DevEx) Simulator
                  </h2>
                  <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                    The Developer Exchange program is Roblox Corporation's official mechanism allowing creators to convert earned Robux into real currency.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <label htmlFor="devex-amount" className="font-semibold text-ink uppercase tracking-wider">
                      Robux Amount to Cash Out
                    </label>
                    <span className="font-mono font-bold text-ink bg-butter px-2.5 py-1 rounded-lg">
                      {formatNumber(devexRobux)} R$
                    </span>
                  </div>
                  <input
                    id="devex-amount"
                    type="range"
                    min="10000"
                    max="500000"
                    step="5000"
                    value={devexRobux}
                    onChange={(e) => setDevexRobux(Number(e.target.value))}
                    className="w-full accent-ink cursor-pointer"
                  />
                  <div className="flex flex-wrap gap-2">
                    {[30000, 50000, 100000, 250000, 500000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setDevexRobux(preset)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          devexRobux === preset
                            ? 'bg-ink text-cream border-ink font-bold'
                            : 'bg-cream text-ink border-ink/20 hover:border-ink/40'
                        }`}
                      >
                        {formatNumber(preset)} R$
                      </button>
                    ))}
                  </div>
                </div>

                {/* Eligibility Notice */}
                <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1.5 ${
                  isEligibleDevEx
                    ? 'bg-mint/40 border-mint/80 text-ink'
                    : 'bg-peach/40 border-peach/80 text-ink'
                }`}>
                  <div className="flex items-center gap-2 font-bold">
                    <span>{isEligibleDevEx ? 'Meets Minimum DevEx Threshold' : 'Below Minimum Threshold'}</span>
                  </div>
                  <p>
                    {isEligibleDevEx
                      ? 'You have reached the 30,000 earned Robux threshold required to submit a cashout request on the Roblox Creator Hub portal.'
                      : `${formatNumber(MIN_DEVEX_THRESHOLD - devexRobux)} more earned Robux required to meet the 30,000 Robux minimum eligibility threshold.`}
                  </p>
                </div>

                {/* Exchange Rate Setting */}
                <div className="pt-4 border-t border-ink/10 flex items-center justify-between text-xs text-ink-soft">
                  <span>USD to IDR Benchmark Rate</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span>Rp</span>
                    <input
                      type="number"
                      value={exchangeRate}
                      onChange={(e) => setExchangeRate(Number(e.target.value))}
                      className="w-24 px-2 py-1 text-xs border rounded-lg bg-cream font-bold text-ink"
                    />
                  </div>
                </div>
              </div>

              {/* DevEx Output Cards Column */}
              <div className="lg:col-span-6 space-y-6">
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-ink/10 shadow-xs space-y-6">
                  <h3 className="font-display text-xl text-ink font-semibold">
                    Estimated Cashout Value
                  </h3>

                  <div className="p-6 rounded-2xl bg-cream border border-ink/10 space-y-4">
                    <div>
                      <span className="text-[11px] font-semibold text-ink-soft uppercase tracking-wider block">
                        Official Roblox DevEx Rate
                      </span>
                      <span className="text-xs font-mono font-bold text-ink">
                        $0.0035 USD / 1 earned Robux
                      </span>
                    </div>

                    <div className="pt-3 border-t border-ink/10 flex justify-between items-center">
                      <span className="text-xs text-ink-soft">Gross Cashout in USD:</span>
                      <span className="font-mono text-xl font-bold text-ink">{formatUSD(devexUSD)}</span>
                    </div>

                    <div className="pt-4 border-t border-ink/15 flex flex-col gap-1">
                      <span className="text-xs font-semibold text-ink uppercase tracking-wider">
                        Estimated Value in IDR:
                      </span>
                      <span className="font-display text-3xl sm:text-4xl font-bold text-ink text-[#185e3a]">
                        {formatIDR(devexIDR)}
                      </span>
                      <span className="text-[11px] text-ink-soft">
                        *Subject to Tipalti processing fees and bank wire conversion rates.
                      </span>
                    </div>
                  </div>

                  {/* DevEx Official Requirements */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-ink block">
                        Official DevEx Requirements:
                      </span>
                      <span className="text-[11px] text-ink-soft font-mono">
                        Last verified: Oct 2026
                      </span>
                    </div>
                    <ul className="text-xs text-ink-soft space-y-1.5">
                      <li className="flex items-center gap-2">
                        <IconCheck className="w-3.5 h-3.5 text-ink shrink-0" />
                        <span>Minimum 30,000 earned Robux in your account balance</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <IconCheck className="w-3.5 h-3.5 text-ink shrink-0" />
                        <span>Verified Roblox account at least 13 years old with valid email</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <IconCheck className="w-3.5 h-3.5 text-ink shrink-0" />
                        <span>Active, verified Tipalti portal registration for payment processing</span>
                      </li>
                    </ul>
                    <div className="pt-2">
                      <a
                        href="https://create.roblox.com/docs/production/monetization/developer-exchange"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-ink font-semibold underline hover:text-ink-soft"
                      >
                        Read official Roblox Developer Exchange documentation &rarr;
                      </a>
                    </div>
                  </div>
                </div>

                {/* Consultation Upsell Callout */}
                <div className="p-6 rounded-2xl bg-butter/50 border border-ink/15 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-ink uppercase tracking-wider">
                      Looking to Optimize In-Game Conversion?
                    </span>
                  </div>
                  <p className="text-xs text-ink leading-relaxed">
                    We help review your monetization loops, sink-faucet balances, and catalog pricing so players invest willingly without aggressive monetization fatigue.
                  </p>
                  <Button href="/contact?service=monetisation-economy" variant="primary" size="sm">
                    Schedule an Economy Consultation &rarr;
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MULTI-ITEM PRO PREVIEW & EARLY ACCESS */}
          {activeTab === 'pro' && (
            <div className="space-y-8 animate-fade-rise">
              <div className="p-8 sm:p-10 rounded-3xl bg-white border-2 border-ink shadow-sm space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ink/10 pb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge color="peach">In-House Tooling</Badge>
                      <Badge color="butter">Planned Micro-SaaS</Badge>
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl text-ink font-bold mt-2">
                      Economy Studio PRO
                    </h2>
                    <p className="text-xs sm:text-sm text-ink-soft mt-1">
                      Multi-gamepass catalog simulation, sink-faucet balance sheets, and exportable GDD specifications for development teams.
                    </p>
                    <p className="text-[11px] text-ink-soft/80 mt-1 italic">
                      Independent software tool. Not affiliated with or endorsed by Roblox Corporation.
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowProModal(true)}
                    variant="peach"
                    size="lg"
                    className="self-start md:self-auto shadow-sm"
                  >
                    Get Early Access (50% Off) &rarr;
                  </Button>
                </div>

                {/* Interactive Multi-Item Matrix Table Preview */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-ink block">
                        Live Catalog Matrix Preview (Project: Archipelago Quest)
                      </span>
                      <span className="text-xs font-mono text-ink-soft">4 Items Simulated</span>
                    </div>

                    {/* Dual Currency Switcher */}
                    <div className="flex items-center gap-1.5 p-1 bg-cream rounded-xl border border-ink/15 self-start sm:self-auto">
                      <span className="text-[11px] font-mono text-ink-soft px-2">Currency:</span>
                      <button
                        type="button"
                        onClick={() => setProCurrency('USD')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          proCurrency === 'USD'
                            ? 'bg-ink text-cream shadow-2xs'
                            : 'text-ink-soft hover:text-ink'
                        }`}
                      >
                        USD ($)
                      </button>
                      <button
                        type="button"
                        onClick={() => setProCurrency('IDR')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          proCurrency === 'IDR'
                            ? 'bg-ink text-cream shadow-2xs'
                            : 'text-ink-soft hover:text-ink'
                        }`}
                      >
                        IDR (Rp)
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-ink/10 rounded-2xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-cream border-b border-ink/10 font-mono uppercase text-ink-soft">
                        <tr>
                          <th className="p-3.5">Gamepass / Developer Product</th>
                          <th className="p-3.5">Price (R$)</th>
                          <th className="p-3.5">Est. Sales/Mo</th>
                          <th className="p-3.5">Platform Cut (30%)</th>
                          <th className="p-3.5 font-bold text-ink">Net Robux / Month</th>
                          <th className="p-3.5">
                            {proCurrency === 'USD' ? 'Est. Value (USD)' : 'Est. Value (IDR)'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-ink/5 font-mono">
                        {proSampleItems.map((item, idx) => (
                          <tr key={idx} className="hover:bg-cream/40">
                            <td className="p-3.5 font-sans font-semibold text-ink">{item.name}</td>
                            <td className="p-3.5">{item.priceRobux} R$</td>
                            <td className="p-3.5">{formatNumber(item.monthlySales)}</td>
                            <td className="p-3.5 text-red-600">-{formatNumber(item.taxRobux)} R$</td>
                            <td className="p-3.5 font-bold text-[#185e3a]">+{formatNumber(item.netRobux)} R$</td>
                            <td className="p-3.5 font-semibold text-ink">
                              {proCurrency === 'USD'
                                ? formatUSD(item.usdValue)
                                : formatIDR(item.usdValue * exchangeRate)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-mint/30 border-t border-ink/10 font-bold">
                        <tr>
                          <td className="p-3.5 font-sans text-ink uppercase">Total Monthly Projection</td>
                          <td className="p-3.5 text-ink-soft">-</td>
                          <td className="p-3.5 font-mono text-ink">{formatNumber(proTotalSales)} sales</td>
                          <td className="p-3.5 text-red-600 font-mono">-{formatNumber(proTotalTax)} R$</td>
                          <td className="p-3.5 text-[#185e3a] font-mono text-sm">+{formatNumber(proTotalNetRobux)} R$</td>
                          <td className="p-3.5 text-ink text-sm">
                            {proCurrency === 'USD'
                              ? `${formatUSD(proTotalUSD)} / mo`
                              : `${formatIDR(proTotalIDR)} / mo`}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Pro Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                  <div className="p-5 rounded-2xl bg-cream border border-ink/10 space-y-2 relative overflow-hidden">
                    <span className="text-xs font-bold text-ink uppercase tracking-wider block">
                      Multi-Item Cloud Presets
                    </span>
                    <p className="text-xs text-ink-soft leading-relaxed">
                      Store catalog balancing matrices for up to 20 items per game. Synchronize configurations directly to your team workspace.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-cream border border-ink/10 space-y-2 relative overflow-hidden">
                    <span className="text-xs font-bold text-ink uppercase tracking-wider block">
                      Progression & Drop Rate Balancing
                    </span>
                    <p className="text-xs text-ink-soft leading-relaxed">
                      Simulate pet drop probabilities, crate multipliers, and time-to-unlock curves to prevent pay-to-win player churn.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-cream border border-ink/10 space-y-2 relative overflow-hidden">
                    <span className="text-xs font-bold text-ink uppercase tracking-wider block">
                      Export GDD & Balance Spreadsheets
                    </span>
                    <p className="text-xs text-ink-soft leading-relaxed">
                      Generate exportable PDF summaries and formatted spreadsheets for scripters and studio stakeholders with one click.
                    </p>
                  </div>
                </div>

                {/* Bottom CTA Box */}
                <div className="p-6 rounded-2xl bg-butter/40 border border-ink/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg text-ink font-bold">
                      Interested in using Economy Studio PRO for your game?
                    </h3>
                    <p className="text-xs text-ink-soft mt-0.5">
                      Join the early access waitlist to receive priority access and a 50% discount when the beta opens.
                    </p>
                  </div>
                  <Button onClick={() => setShowProModal(true)} variant="primary" size="md">
                    Join VIP Waitlist
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* ── PRICING TIPS GUIDE ── */}
      <Section background="white">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl text-ink font-semibold">
              Tips for Pricing Roblox Gamepasses
            </h2>
            <p className="text-xs sm:text-sm text-ink-soft">
              A concise guide to catalog pricing without disrupting player progression balance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card accent="mint" className="space-y-3">
              <span className="text-xs font-bold font-mono text-ink uppercase tracking-wider">
                Tier 1: Impulse (25 to 99 R$)
              </span>
              <p className="text-xs text-ink-soft leading-relaxed">
                Suited for small cosmetics, VIP chat tags, particle trails, or sound emitters. Low cognitive friction for younger players.
              </p>
            </Card>

            <Card accent="peach" className="space-y-3">
              <span className="text-xs font-bold font-mono text-ink uppercase tracking-wider">
                Tier 2: Utility (150 to 450 R$)
              </span>
              <p className="text-xs text-ink-soft leading-relaxed">
                Suited for 2x Speed, Auto-Collect, or expanded inventory slots. Ensure free-to-play participants still enjoy a fair core progression loop.
              </p>
            </Card>

            <Card accent="lavender" className="space-y-3">
              <span className="text-xs font-bold font-mono text-ink uppercase tracking-wider">
                Tier 3: Prestige (750 to 2,500 R$)
              </span>
              <p className="text-xs text-ink-soft leading-relaxed">
                Suited for exclusive area access, custom vehicles, or founder bundles. Targeted at dedicated core supporters and guild leaders.
              </p>
            </Card>
          </div>
        </div>
      </Section>

      {/* ── PRO EARLY ACCESS MODAL ── */}
      <Modal
        isOpen={showProModal}
        onClose={() => { setShowProModal(false); setProSuccess(false); setProError(''); }}
        title="Join Early Access &middot; Economy Studio PRO"
      >
        {proSuccess ? (
          <div className="space-y-4 py-4 text-center">
            <div className="w-12 h-12 rounded-full bg-mint mx-auto flex items-center justify-center text-ink">
              <IconCheck className="w-6 h-6" />
            </div>
            <h4 className="font-display text-xl text-ink font-bold">
              You Are on the Waitlist!
            </h4>
            <p className="text-xs text-ink-soft leading-relaxed">
              Thank you! We have recorded your email. You will receive priority invitation details and a <strong>50% discount voucher</strong> when the private beta opens.
            </p>
            <Button onClick={() => setShowProModal(false)} variant="primary" size="md">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleWaitlistSubmit} className="space-y-4">
            <p className="text-xs text-ink-soft leading-relaxed">
              Register now to receive private beta invitations to our multi-item catalog simulator and exportable GDD balance tools.
            </p>

            {proError && (
              <div className="p-3 rounded-xl bg-red-100 text-red-800 text-xs">
                {proError}
              </div>
            )}

            <div>
              <label htmlFor="pro-name" className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1">
                Your Name
              </label>
              <input
                id="pro-name"
                type="text"
                required
                placeholder="e.g. Alex"
                value={proName}
                onChange={(e) => setProName(e.target.value)}
                className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 text-sm bg-white"
              />
            </div>

            <div>
              <label htmlFor="pro-email" className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1">
                Work / Studio Email <span className="text-red-500">*</span>
              </label>
              <input
                id="pro-email"
                type="email"
                required
                placeholder="alex@studio.com"
                value={proEmail}
                onChange={(e) => setProEmail(e.target.value)}
                className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 text-sm bg-white"
              />
            </div>

            <div>
              <label htmlFor="pro-discord" className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1">
                Discord Handle / Contact (Optional)
              </label>
              <input
                id="pro-discord"
                type="text"
                placeholder="e.g. alex_dev#1234"
                value={proDiscord}
                onChange={(e) => setProDiscord(e.target.value)}
                className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 text-sm bg-white"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button onClick={() => setShowProModal(false)} variant="secondary" size="md" type="button">
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" disabled={proSubmitting}>
                {proSubmitting ? 'Registering...' : 'Claim 50% Early Access Voucher'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </AppLayout>
  );
}
