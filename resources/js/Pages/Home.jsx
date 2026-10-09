import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import Button from '../Components/Button';
import Card from '../Components/Card';
import Badge from '../Components/Badge';
import Section from '../Components/Section';
import { ServiceIcon, IconArrowRight, IconCheck } from '../Components/Icons';
import { StudioCompass } from '../Components/Motifs';

export default function Home({ services = [], featured = [] }) {
  // ── 1. INTERACTIVE HERO DIAGNOSTIC STATE ──
  const diagnosticItems = [
    {
      id: 'datastore',
      title: 'BindToClose DataStore Lifecycle',
      desc: 'Flushes player session data safely before server updates shutdown.',
    },
    {
      id: 'remotes',
      title: 'RemoteEvent Network Rate Limiter',
      desc: 'Throttles repeated client remote calls to keep server tick rate stable.',
    },
    {
      id: 'economy',
      title: 'Retention-Calibrated Economy',
      desc: 'Balances Day 1 to Day 7 grind curves with fair player-first monetization.',
    },
    {
      id: 'mobile_ui',
      title: 'ScreenGui Responsive Mobile Bounds',
      desc: 'Ensures touch controls and shop menus fit small mobile screens cleanly.',
    },
  ];

  const [activeDiagnostics, setActiveDiagnostics] = useState(['datastore', 'economy']);

  const toggleDiagnostic = (id) => {
    setActiveDiagnostics((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const score = Math.round((activeDiagnostics.length / diagnosticItems.length) * 100);

  const getScoreAssessment = () => {
    if (score === 100) {
      return {
        badgeColor: 'mint',
        status: 'Architecture Ready for Scale',
        note: 'Robust engineering baseline. Low vulnerability to unexpected server restarts or traffic spikes.',
      };
    }
    if (score === 75) {
      return {
        badgeColor: 'butter',
        status: 'Low Architecture Risk',
        note: 'Solid foundation. Resolve the remaining unconfigured vector before shipping major marketing pushes.',
      };
    }
    if (score === 50) {
      return {
        badgeColor: 'peach',
        status: 'Moderate Vulnerability',
        note: 'Network bottlenecks or progression churn likely when concurrent player counts increase.',
      };
    }
    return {
      badgeColor: 'peach',
      status: 'High Infrastructure Fragility',
      note: 'Significant exposure to player data rollback, exploit flooding, or rapid early-game churn.',
    };
  };

  const assessment = getScoreAssessment();

  // ── 2. INTERACTIVE ARCHITECTURE LAB (BEFORE & AFTER LUAU VIEWER) ──
  const [activeLabTab, setActiveLabTab] = useState('datastore');
  const [labMode, setLabMode] = useState('hardened'); // 'hardened' | 'fragile'
  const [copiedLabCode, setCopiedLabCode] = useState(false);

  const architectureLabData = {
    datastore: {
      title: 'DataStore Shutdown Lifecycle',
      topic: 'DataStore Persistence',
      risk: 'Player progress wiped on unexpected server restarts or Roblox studio updates.',
      fragileCode: `-- Fragile Pattern: Relies only on PlayerRemoving
Players.PlayerRemoving:Connect(function(player)
    -- When server terminates abruptly, this thread is killed mid-execution!
    local data = SessionData[player.UserId]
    PlayerDataStore:SetAsync("User_" .. player.UserId, data)
end)
-- Result: Lost coins, lost inventory items, and negative player ratings.`,
      hardenedCode: `--!strict
-- Production Pattern: BindToClose safety lifecycle with batching
local function SavePlayerData(player: Player): boolean
    local userId = player.UserId
    local data = SessionData[userId]
    if not data then return true end

    local success, err = pcall(function()
        PlayerDataStore:UpdateAsync("User_" .. userId, function()
            return data
        end)
    end)
    return success
end

Players.PlayerRemoving:Connect(SavePlayerData)

-- Flushes all remaining player threads safely before instance terminates
game:BindToClose(function()
    if RunService:IsStudio() then return end
    local remaining = Players:GetPlayers()
    for _, player in remaining do
        task.spawn(SavePlayerData, player)
    end
    task.wait(2) -- Allow async writes to resolve cleanly
end)`,
      explanation: 'Roblox servers terminate unexpectedly when experiences update. Without BindToClose holding the shutdown sequence, PlayerRemoving threads are cut off mid-flight. Our pattern guarantees all active session states flush safely.',
    },
    remotes: {
      title: 'RemoteEvent Anti-Flood Rate Limiting',
      topic: 'Network Security',
      risk: 'Exploiters firing remote events 500 times per second, dropping server tick rate to 10 FPS.',
      fragileCode: `-- Fragile Pattern: Zero server-side rate validation
FireWeaponRemote.OnServerEvent:Connect(function(player, targetId)
    -- Processes unbounded client requests immediately!
    DealDamage(player, targetId)
    PlayHitSound:FireAllClients(targetId)
end)
-- Result: Server memory spikes, physics lag, and network replication freeze.`,
      hardenedCode: `--!strict
-- Production Pattern: Token Bucket rate limiter per player instance
local RequestHistory: { [number]: { count: number, resetAt: number } } = {}
local MAX_CALLS_PER_SEC = 10

FireWeaponRemote.OnServerEvent:Connect(function(player: Player, targetId: number)
    local userId = player.UserId
    local now = os.clock()
    local record = RequestHistory[userId] or { count = 0, resetAt = now + 1 }

    if now > record.resetAt then
        record.count = 0
        record.resetAt = now + 1
    end

    record.count += 1
    RequestHistory[userId] = record

    if record.count > MAX_CALLS_PER_SEC then
        warn(string.format("[Security] Throttled spam from UserId: %d", userId))
        return
    end

    DealDamage(player, targetId)
end)`,
      explanation: 'Never trust input from the Roblox client. Naive remote listeners crash game instances under burst spam. We implement player-keyed rate limiting that drops unauthorized burst events silently.',
    },
    janitor: {
      title: 'Connection Memory Leak Cleanup',
      topic: 'Engine Performance',
      risk: 'RunService listeners accumulating on dynamic instances, degrading server performance over time.',
      fragileCode: `-- Fragile Pattern: Dangling event connections
local function SpawnBossEntity()
    local boss = BossModel:Clone()
    boss.Parent = workspace

    -- Connection remains active even after boss is destroyed!
    RunService.Heartbeat:Connect(function(dt)
        UpdateBossAI(boss, dt)
    end)
end
-- Result: Memory leak grows by 150MB per hour, causing rubberbanding.`,
      hardenedCode: `--!strict
-- Production Pattern: Explicit lifecycle cleanup connection
local function SpawnBossEntity()
    local boss = BossModel:Clone()
    boss.Parent = workspace

    local heartbeatConn: RBXScriptConnection? = nil
    heartbeatConn = RunService.Heartbeat:Connect(function(dt: number)
        if not boss:IsDescendantOf(workspace) then
            if heartbeatConn then heartbeatConn:Disconnect() end
            return
        end
        UpdateBossAI(boss, dt)
    end)

    boss.Destroying:Once(function()
        if heartbeatConn then
            heartbeatConn:Disconnect()
            heartbeatConn = nil
        end
    end)
end)`,
      explanation: 'Roblox instances destroyed via script do not automatically release Lua-side event connections. Unclosed listeners accumulate in memory and degrade server frame rate. We enforce strict connection tracking across all game systems.',
    },
  };

  const currentLab = architectureLabData[activeLabTab];

  const handleCopyLabCode = () => {
    const textToCopy = labMode === 'hardened' ? currentLab.hardenedCode : currentLab.fragileCode;
    navigator.clipboard.writeText(textToCopy);
    setCopiedLabCode(true);
    setTimeout(() => setCopiedLabCode(false), 2000);
  };

  // ── 3. INTERACTIVE B2B PROJECT ESTIMATOR STATE ──
  const [estimatorScope, setEstimatorScope] = useState('code'); // 'code' | 'economy' | 'launch'
  const [estimatorStage, setEstimatorStage] = useState('scaling'); // 'alpha' | 'scaling' | 'brand'
  const [estimatorCurrency, setEstimatorCurrency] = useState('idr'); // 'idr' | 'usd'

  const calculateEstimate = () => {
    let packageName = 'Studio';
    let packageSlug = 'studio';
    let serviceSlug = 'luau-scripting-review';
    let idrPrice = 5000000;
    let usdPrice = 350;
    let duration = '10 to 14 Business Days';
    let deliverables = [];

    if (estimatorScope === 'code') {
      serviceSlug = 'luau-scripting-review';
      if (estimatorStage === 'alpha') {
        packageName = 'Starter';
        packageSlug = 'starter';
        idrPrice = 1500000;
        usdPrice = 100;
        duration = '3 to 5 Business Days';
        deliverables = [
          'Annotated Luau codebase review',
          'DataStore lifecycle verification',
          'RemoteEvent security check',
          '3 days async developer support',
        ];
      } else if (estimatorStage === 'scaling') {
        packageName = 'Studio';
        packageSlug = 'studio';
        idrPrice = 5000000;
        usdPrice = 350;
        duration = '10 to 14 Business Days';
        deliverables = [
          'Full architecture and memory profiling',
          'Client-server network throttler review',
          'DataStore UpdateAsync migration roadmap',
          '2 weeks async developer support',
        ];
      } else {
        packageName = 'Brand / Custom';
        packageSlug = 'brand';
        idrPrice = 15000000;
        usdPrice = 1000;
        duration = '3 to 4 Weeks';
        deliverables = [
          'End-to-end engine stress test and optimization',
          'Custom Luau framework structuring',
          'Live production launch monitoring',
          'Dedicated Notion workspace and weekly calls',
        ];
      }
    } else if (estimatorScope === 'economy') {
      serviceSlug = 'monetisation-economy';
      if (estimatorStage === 'alpha') {
        packageName = 'Starter';
        packageSlug = 'starter';
        idrPrice = 1500000;
        usdPrice = 100;
        duration = '3 to 5 Business Days';
        deliverables = [
          'Economy loop design review',
          'Grind curve sanity check',
          'Monetization fairness assessment',
          '3 days async support',
        ];
      } else if (estimatorStage === 'scaling') {
        packageName = 'Studio';
        packageSlug = 'studio';
        idrPrice = 5000000;
        usdPrice = 350;
        duration = '10 to 14 Business Days';
        deliverables = [
          'Mathematical economy spreadsheet model',
          'Robux pass and DevProduct pricing tiers',
          'Inflation sinks and player retention touchpoints',
          '2 weeks async support',
        ];
      } else {
        packageName = 'Brand / Custom';
        packageSlug = 'brand';
        idrPrice = 15000000;
        usdPrice = 1000;
        duration = '3 to 4 Weeks';
        deliverables = [
          'Comprehensive multi-tier economy simulation',
          'Virtual item catalog pricing strategy',
          'Platform compliance and loot-box risk audit',
          'Priority live-ops telemetry planning',
        ];
      }
    } else {
      serviceSlug = 'launch-liveops';
      if (estimatorStage === 'alpha') {
        packageName = 'Starter';
        packageSlug = 'starter';
        idrPrice = 1500000;
        usdPrice = 100;
        duration = '3 to 5 Business Days';
        deliverables = [
          'Launch readiness checklist',
          'Core loop verification',
          'Roblox SEO and title audit',
          '3 days async follow-up',
        ];
      } else if (estimatorStage === 'scaling') {
        packageName = 'Studio';
        packageSlug = 'studio';
        idrPrice = 5000000;
        usdPrice = 350;
        duration = '10 to 14 Business Days';
        deliverables = [
          '90-day live-ops content calendar',
          'Analytics event tracking specification',
          'Creator activation playbook',
          'Post-launch 30-day review call',
        ];
      } else {
        packageName = 'Brand / Custom';
        packageSlug = 'brand';
        idrPrice = 15000000;
        usdPrice = 1000;
        duration = '4 to 6 Weeks';
        deliverables = [
          'Full go-to-market launch advisory',
          'Roblox brand event integration plan',
          'Live-ops roadmap and content cadence',
          'Dedicated lead advisory with Hafizh & Rainer',
        ];
      }
    }

    return {
      packageName,
      packageSlug,
      serviceSlug,
      price: estimatorCurrency === 'idr' ? `Rp ${idrPrice.toLocaleString('id-ID')}` : `$${usdPrice}`,
      duration,
      deliverables,
    };
  };

  const estimate = calculateEstimate();

  // ── 4. INTERACTIVE SERVICES FILTER STATE ──
  const [serviceCategory, setServiceCategory] = useState('all');

  const filteredServices = services.filter((service) => {
    if (serviceCategory === 'all') return true;
    if (serviceCategory === 'code') return service.slug.includes('scripting');
    if (serviceCategory === 'economy') return service.slug.includes('economy') || service.slug.includes('monetisation');
    if (serviceCategory === 'design') return service.slug.includes('launch') || service.slug.includes('concept') || service.slug.includes('ui');
    return true;
  });

  const targetAudiences = [
    {
      title: 'Indie Game Creators & Teams',
      desc: 'You have a working prototype or core mechanic, but need engineering review on game loops, retention hooks, and data store stability before launching.',
      badge: 'mint',
    },
    {
      title: 'Scaling Roblox Studios',
      desc: 'You are shipping regular updates and need external code reviews, economy balancing, or live-ops scheduling to maintain steady concurrent players.',
      badge: 'peach',
    },
    {
      title: 'Brands & Digital Agencies',
      desc: 'You want an authentic Roblox presence built around player engagement and platform culture, backed by formal B2B agreements and milestone reviews.',
      badge: 'lavender',
    },
  ];

  const processSteps = [
    { num: '01', title: 'Consultation', desc: 'A focused 60-minute session to unpack your goals, audience, and current blockers.' },
    { num: '02', title: 'Scoping', desc: 'A clear written brief with specific deliverables, agreed timelines, and milestone checkpoints.' },
    { num: '03', title: 'Execution', desc: 'Hands-on architecture reviews, economy balancing sheets, or UI flows crafted with care.' },
    { num: '04', title: 'Handover', desc: 'Annotated documentation, team walkthrough calls, and async follow-up while you implement.' },
  ];

  return (
    <AppLayout
      title="Roblox Game Development Consultancy"
      description="We help creators, studios, and brands plan, refine, and ship resilient Roblox games with confidence."
    >
      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-ink/10 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-peach/50 border border-ink/10 text-xs font-semibold text-ink">
                <span>Independent Roblox Game Advisory &middot; Founded in Indonesia</span>
              </div>

              {/* Value proposition: specific one-sentence */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-ink leading-[1.1] tracking-tight">
                Technical code audits, economy design, and launch roadmaps for Roblox creators.
              </h1>

              <p className="text-base sm:text-lg text-ink-soft leading-relaxed max-w-xl">
                We inspect Luau codebases in Roblox Studio for memory leaks and networking bottlenecks, design sustainable in-game economies, and structure milestone roadmaps. Advisory founded on verified engine practices with clear, fixed deliverables.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button href="/contact" variant="primary" size="lg">
                  Book a Consultation
                </Button>
                <Button href="/services" variant="secondary" size="lg">
                  Explore Services
                </Button>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-ink-soft border-t border-ink/10">
                <div className="flex items-center gap-1.5">
                  <IconCheck className="w-3.5 h-3.5 text-ink" />
                  <span>Fixed scope B2B contracts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <IconCheck className="w-3.5 h-3.5 text-ink" />
                  <span>Quotes in IDR & USD</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <IconCheck className="w-3.5 h-3.5 text-ink" />
                  <span>Not affiliated with Roblox Corporation</span>
                </div>
              </div>
            </div>

            {/* Right Hero Column: Interactive Experience Health Diagnostic Console */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-full max-w-md p-6 sm:p-7 bg-white rounded-3xl border-2 border-ink shadow-md space-y-5">
                {/* Console Header */}
                <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-peach border border-ink/20" />
                    <span className="w-3 h-3 rounded-full bg-mint border border-ink/20" />
                    <span className="w-3 h-3 rounded-full bg-lavender border border-ink/20" />
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                    engine.health_inspector
                  </span>
                </div>

                {/* Score & Live Status */}
                <div className="p-4 rounded-2xl bg-cream border border-ink/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                      Architecture Score
                    </span>
                    <Badge color={assessment.badgeColor} size="sm">
                      {score}% &middot; {assessment.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-ink leading-relaxed">
                    {assessment.note}
                  </p>
                </div>

                {/* Interactive Toggles */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-ink-soft font-mono uppercase tracking-wider px-1">
                    <span>Interactive Checklist</span>
                    <span>Tap to Toggle</span>
                  </div>

                  <div className="space-y-2">
                    {diagnosticItems.map((item) => {
                      const isChecked = activeDiagnostics.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleDiagnostic(item.id)}
                          className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                            isChecked
                              ? 'bg-mint/20 border-mint/80 shadow-2xs'
                              : 'bg-white border-ink/15 hover:border-ink/30'
                          }`}
                        >
                          <span
                            className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors ${
                              isChecked
                                ? 'bg-ink text-cream border-ink'
                                : 'border-ink/30 bg-cream'
                            }`}
                          >
                            {isChecked && <IconCheck className="w-3 h-3" />}
                          </span>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-semibold text-ink block leading-tight">
                              {item.title}
                            </span>
                            <span className="text-[11px] text-ink-soft block mt-0.5 leading-snug">
                              {item.desc}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Card CTA */}
                <div className="pt-2 border-t border-ink/10 flex items-center justify-between gap-3 text-xs">
                  <span className="text-[11px] text-ink-soft">
                    {activeDiagnostics.length} of {diagnosticItems.length} passed
                  </span>
                  <Link
                    href="/contact?service=luau-scripting-review"
                    className="inline-flex items-center gap-1 font-semibold text-ink hover:underline"
                  >
                    <span>Request Full Audit</span>
                    <IconArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO THIS IS FOR ── */}
      <Section background="mint-tint">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge color="mint" className="mb-3">Who It Is For</Badge>
          <h2 className="font-display text-3xl sm:text-4xl text-ink tracking-tight">
            Built for creators and studios who treat game development as a discipline.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-ink-soft">
            Whether you are writing your first complex data store script or steering a studio launch, we provide actionable clarity at every milestone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {targetAudiences.map((audience, idx) => (
            <Card key={idx} accent={audience.badge} className="flex flex-col justify-between">
              <div className="space-y-3">
                <Badge color={audience.badge} size="sm">B2B Focus 0{idx + 1}</Badge>
                <h3 className="font-display text-xl text-ink font-semibold">
                  {audience.title}
                </h3>
                <p className="text-sm text-ink-soft leading-relaxed">
                  {audience.desc}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── INTERACTIVE ARCHITECTURE LAB (LUAU CODE AUDIT WORKBENCH) ── */}
      <Section background="cream">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
            <div className="max-w-xl">
              <Badge color="butter" className="mb-3">Interactive Architecture Lab</Badge>
              <h2 className="font-display text-3xl sm:text-4xl text-ink tracking-tight">
                Inspect how we refactor fragile Roblox code.
              </h2>
              <p className="text-sm text-ink-soft mt-2">
                Toggle between standard tutorial patterns that fail under load and hardened Luau patterns used in production.
              </p>
            </div>
            <Link
              href="/snippets"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink underline hover:text-ink-soft"
            >
              <span>Explore all production snippets in our vault</span>
              <IconArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl border-2 border-ink shadow-sm overflow-hidden">
            {/* Workbench Navigation Header */}
            <div className="p-4 sm:p-5 bg-cream/70 border-b-2 border-ink flex flex-wrap items-center justify-between gap-4">
              {/* Category Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'datastore', label: '1. DataStore Shutdown' },
                  { id: 'remotes', label: '2. RemoteEvent Throttler' },
                  { id: 'janitor', label: '3. Memory Cleanup' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveLabTab(tab.id);
                      setCopiedLabCode(false);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      activeLabTab === tab.id
                        ? 'bg-ink text-cream border-ink shadow-2xs'
                        : 'bg-white text-ink-soft border-ink/20 hover:border-ink/40 hover:text-ink'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Fragile vs Hardened Switcher */}
              <div className="flex items-center bg-white p-1 rounded-xl border border-ink/20">
                <button
                  type="button"
                  onClick={() => setLabMode('fragile')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    labMode === 'fragile'
                      ? 'bg-peach text-ink font-bold shadow-2xs'
                      : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  Fragile Pattern
                </button>
                <button
                  type="button"
                  onClick={() => setLabMode('hardened')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    labMode === 'hardened'
                      ? 'bg-mint text-ink font-bold shadow-2xs'
                      : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  Production Pattern
                </button>
              </div>
            </div>

            {/* Workbench Code Display Area */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Context Summary Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-cream border border-ink/10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-soft">
                      {currentLab.topic}
                    </span>
                    <Badge color={labMode === 'hardened' ? 'mint' : 'peach'} size="sm">
                      {labMode === 'hardened' ? 'Hardened Architecture' : 'Common Tutorial Trap'}
                    </Badge>
                  </div>
                  <h3 className="font-display text-lg text-ink font-bold">
                    {currentLab.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handleCopyLabCode}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-ink/20 text-xs font-semibold text-ink hover:bg-cream transition-colors cursor-pointer self-start sm:self-auto shrink-0"
                >
                  {copiedLabCode ? 'Copied to Clipboard!' : 'Copy Code Snippet'}
                </button>
              </div>

              {/* Code Pre Box */}
              <div className="relative rounded-2xl bg-[#1E1E24] text-[#E0E0E6] p-4 sm:p-6 font-mono text-xs overflow-x-auto shadow-inner leading-relaxed">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-[11px] text-white/50">
                  <span>Luau Strict &middot; {labMode === 'hardened' ? 'Production Standard' : 'Fragile Draft'}</span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold">
                    {labMode === 'hardened' ? 'Status: Resilient' : 'Status: High Risk'}
                  </span>
                </div>
                <pre className="overflow-x-auto whitespace-pre">
                  <code>
                    {labMode === 'hardened' ? currentLab.hardenedCode : currentLab.fragileCode}
                  </code>
                </pre>
              </div>

              {/* Engineering Analysis Note */}
              <div className="p-4 rounded-2xl border border-ink/15 bg-white space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-ink">
                  <span className="w-2 h-2 rounded-full bg-ink" />
                  <span>Engineering Rationale:</span>
                </div>
                <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                  {currentLab.explanation}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── SERVICES OVERVIEW WITH INTERACTIVE FILTER ── */}
      <Section background="peach-tint">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div className="max-w-xl">
            <Badge color="peach" className="mb-3">Our Services</Badge>
            <h2 className="font-display text-3xl sm:text-4xl text-ink tracking-tight">
              Focused advisory for each layer of your experience.
            </h2>
            <p className="text-sm text-ink-soft mt-2">
              Filter by core challenge or inspect our complete consulting catalog.
            </p>
          </div>
          <Button href="/services" variant="outline" size="md">
            View All Services &rarr;
          </Button>
        </div>

        {/* Interactive Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'all', label: 'All Services', count: services.length },
            { id: 'code', label: 'Architecture & Luau', count: 1 },
            { id: 'economy', label: 'Economy & Balance', count: 2 },
            { id: 'design', label: 'Concept & Live-Ops', count: 2 },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setServiceCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                serviceCategory === cat.id
                  ? 'bg-ink text-cream border-ink shadow-2xs'
                  : 'bg-white text-ink-soft border-ink/15 hover:border-ink/30 hover:text-ink'
              }`}
            >
              <span>{cat.label}</span>
              <span className="ml-1.5 opacity-60 font-mono text-[10px]">({cat.count})</span>
            </button>
          ))}
        </div>

        {/* Filtered Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} accent="peach" className="flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-peach/40 border border-ink/15 flex items-center justify-center text-ink">
                  <ServiceIcon name={service.icon_key} className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-ink font-semibold">
                    {service.title}
                  </h3>
                  <p className="text-xs font-medium text-ink-soft mt-1">
                    {service.tagline}
                  </p>
                </div>
                <p className="text-sm text-ink-soft line-clamp-3 leading-relaxed">
                  {service.description}
                </p>
              </div>
              <div className="pt-6 border-t border-ink/10 mt-6">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink hover:underline"
                >
                  <span>See deliverables and details</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── INTERACTIVE B2B PROJECT ESTIMATOR ── */}
      <Section background="cream">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-8">
            <Badge color="lavender" className="mb-3">Interactive Scope Estimator</Badge>
            <h2 className="font-display text-3xl sm:text-4xl text-ink tracking-tight">
              Estimate your consulting engagement timeline and deliverables.
            </h2>
            <p className="text-sm text-ink-soft mt-2">
              Select your focus area and game stage to preview the recommended scope, timeline, and deliverables before reaching out.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Controls Column */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border-2 border-ink shadow-sm space-y-6">
              {/* Question 1: Scope */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase font-bold text-ink-soft tracking-wider block">
                  1. Primary Advisory Challenge
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'code', label: 'Luau Code Audit' },
                    { id: 'economy', label: 'Economy Balancing' },
                    { id: 'launch', label: 'Launch & Live-Ops' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setEstimatorScope(item.id)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                        estimatorScope === item.id
                          ? 'bg-ink text-cream border-ink'
                          : 'bg-cream/50 text-ink-soft border-ink/15 hover:border-ink/30'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Project Stage */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase font-bold text-ink-soft tracking-wider block">
                  2. Current Project Stage
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'alpha', label: 'Prototype / Alpha' },
                    { id: 'scaling', label: 'Active Live Game' },
                    { id: 'brand', label: 'Brand Activation' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setEstimatorStage(item.id)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                        estimatorStage === item.id
                          ? 'bg-ink text-cream border-ink'
                          : 'bg-cream/50 text-ink-soft border-ink/15 hover:border-ink/30'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: Currency Switcher */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase font-bold text-ink-soft tracking-wider block">
                  3. Currency Preference
                </label>
                <div className="inline-flex p-1 bg-cream rounded-xl border border-ink/20">
                  <button
                    type="button"
                    onClick={() => setEstimatorCurrency('idr')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      estimatorCurrency === 'idr'
                        ? 'bg-ink text-cream'
                        : 'text-ink-soft hover:text-ink'
                    }`}
                  >
                    Indonesian Rupiah (IDR)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEstimatorCurrency('usd')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      estimatorCurrency === 'usd'
                        ? 'bg-ink text-cream'
                        : 'text-ink-soft hover:text-ink'
                    }`}
                  >
                    US Dollars (USD)
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-ink/10 text-xs text-ink-soft flex items-center gap-2">
                <IconCheck className="w-4 h-4 text-ink shrink-0" />
                <span>All engagements include mutual NDA protection and fixed-price contracts.</span>
              </div>
            </div>

            {/* Right Result Column */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border-2 border-ink shadow-md space-y-6">
              <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-ink-soft">
                  Estimated Engagement
                </span>
                <Badge color="butter" size="sm">
                  {estimate.packageName} Tier
                </Badge>
              </div>

              <div>
                <span className="text-xs text-ink-soft block font-medium">Estimated Starting Investment</span>
                <div className="font-display text-3xl sm:text-4xl text-ink font-bold mt-1">
                  {estimate.price}
                </div>
                <span className="text-xs text-ink-soft mt-1 block">
                  Timeline: <strong className="text-ink font-semibold">{estimate.duration}</strong>
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono uppercase tracking-wider text-ink-soft block">
                  Included Milestone Deliverables
                </span>
                <ul className="space-y-2 text-xs text-ink">
                  {estimate.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-0.5 w-3.5 h-3.5 rounded-full bg-mint/50 border border-ink/30 flex items-center justify-center shrink-0">
                        <IconCheck className="w-2.5 h-2.5 text-ink" />
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-ink/10 space-y-3">
                <Button
                  href={`/contact?service=${estimate.serviceSlug}&package=${estimate.packageSlug}`}
                  variant="primary"
                  size="md"
                  className="w-full justify-center"
                >
                  Book This Scope &rarr;
                </Button>
                <p className="text-[11px] text-center text-ink-soft leading-tight">
                  Transparent fixed pricing. No hidden fees or unexpected billable hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── FEATURED PROJECTS / CASE STUDIES ── */}
      <Section background="lavender-tint">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <Badge color="lavender" className="mb-3">Case Studies</Badge>
            <h2 className="font-display text-3xl sm:text-4xl text-ink tracking-tight">
              Real problem solving for Roblox projects.
            </h2>
          </div>
          <Button href="/portfolio" variant="outline" size="md">
            Full Portfolio &rarr;
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featured.map((item) => (
            <Card key={item.id} accent={item.accent_color} className="flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-ink-soft">
                    {item.category}
                  </span>
                  <Badge color={item.accent_color} size="sm">Case Study</Badge>
                </div>
                <h3 className="font-display text-2xl text-ink font-semibold">
                  {item.title}
                </h3>
                <p className="text-sm text-ink-soft leading-relaxed">
                  {item.summary}
                </p>
              </div>
              <div className="pt-6 border-t border-ink/10 mt-6 flex items-center justify-between">
                <span className="text-xs text-ink-soft">Client: {item.client}</span>
                <Link
                  href={`/portfolio/${item.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink hover:underline"
                >
                  <span>Read case study</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── FREE CREATOR TOOLS & IN-HOUSE TOOLING SHOWCASE ── */}
      <Section background="cream">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge color="sky" className="mb-3">Engineering & In-House Tooling</Badge>
            <h2 className="font-display text-3xl sm:text-4xl text-ink tracking-tight">
              We build tools for the Roblox creator ecosystem.
            </h2>
            <p className="mt-3 text-sm text-ink-soft">
              In addition to client advisory, we develop interactive web utilities and open-source snippets to help developers avoid platform pitfalls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-ink/15 flex flex-col justify-between space-y-4 shadow-xs">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-butter border border-ink/20 flex items-center justify-center font-mono font-bold text-ink text-sm">
                  R$
                </div>
                <h3 className="font-display text-lg text-ink font-bold">
                  Robux & DevEx Net Calculator
                </h3>
                <p className="text-xs text-ink-soft leading-relaxed">
                  Calculate net earnings after the 30% platform fee, DevEx cashout conversion, and withholding estimates. Includes official Roblox documentation citations.
                </p>
              </div>
              <div className="pt-4 border-t border-ink/10">
                <Link
                  href="/calculator"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink hover:underline"
                >
                  <span>Open DevEx Calculator</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-ink/15 flex flex-col justify-between space-y-4 shadow-xs">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-mint border border-ink/20 flex items-center justify-center font-mono font-bold text-ink text-sm">
                  &lt;/&gt;
                </div>
                <h3 className="font-display text-lg text-ink font-bold">
                  Luau Production Snippets Vault
                </h3>
                <p className="text-xs text-ink-soft leading-relaxed">
                  Five battle-tested Luau modules covering BindToClose lifecycle, remote throttling, and profile backups with strict type annotations.
                </p>
              </div>
              <div className="pt-4 border-t border-ink/10">
                <Link
                  href="/snippets"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink hover:underline"
                >
                  <span>Browse Snippets Vault</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-ink/15 flex flex-col justify-between space-y-4 shadow-xs">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-lavender border border-ink/20 flex items-center justify-center font-mono font-bold text-ink text-sm">
                  PRO
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg text-ink font-bold">
                    Economy Studio PRO
                  </h3>
                  <Badge color="butter" size="sm">Planned SaaS</Badge>
                </div>
                <p className="text-xs text-ink-soft leading-relaxed">
                  Our upcoming browser-based simulation suite for testing player progression curves, currency sinks, and virtual shop balance.
                </p>
              </div>
              <div className="pt-4 border-t border-ink/10">
                <Link
                  href="/packages"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink hover:underline"
                >
                  <span>View SaaS Roadmap</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── PROCESS STRIP ── */}
      <Section background="butter-tint">
        <div className="text-center max-w-xl mx-auto mb-12">
          <Badge color="butter" className="mb-3">How We Work</Badge>
          <h2 className="font-display text-3xl sm:text-4xl text-ink tracking-tight">
            Clear steps with no surprises.
          </h2>
          <p className="mt-2 text-sm text-ink-soft">
            We operate in four distinct phases to respect your roadmap and delivery dates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {processSteps.map((step) => (
            <div
              key={step.num}
              className="p-6 rounded-2xl bg-white border border-ink/10 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-bold text-ink/30">{step.num}</span>
                <span className="w-2 h-2 rounded-full bg-butter border border-ink/30" />
              </div>
              <div>
                <h3 className="font-display text-lg text-ink font-semibold">{step.title}</h3>
                <p className="text-xs text-ink-soft mt-2 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/process" className="text-xs font-semibold text-ink underline hover:text-ink-soft">
            See timeline estimates and detailed breakdown &rarr;
          </Link>
        </div>
      </Section>

      {/* ── FOUNDERS & IN-HOUSE ENGINEERING BLOCK ── */}
      <Section background="cream">
        <div className="max-w-4xl mx-auto p-8 sm:p-12 rounded-3xl bg-white border-2 border-ink shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/10 pb-6">
            <div>
              <Badge color="butter" size="sm">Studio Leadership</Badge>
              <h2 className="font-display text-2xl sm:text-3xl text-ink font-bold mt-2">
                Built by Developers Who Code for the Engine and the Web
              </h2>
            </div>
            <span className="text-xs font-mono text-ink-soft bg-cream px-3 py-1.5 rounded-xl border border-ink/10 self-start sm:self-auto">
              B2B Studio &middot; Indonesia
            </span>
          </div>

          <p className="text-sm sm:text-base text-ink-soft leading-relaxed">
            We are not a marketing agency using third-party contractors. We are an independent software and game systems practice founded by Hafizh Vito and Rainer. We inspect Luau codebases, model sustainable game economies, and build custom web and simulator tooling in-house. When your team works with us, you collaborate directly with the engineers analyzing your code.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#FFFBF8] border border-ink/15 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-peach border border-ink/15 flex items-center justify-center font-display font-bold text-ink">
                  V
                </div>
                <div>
                  <h3 className="font-display text-lg text-ink font-bold leading-tight">
                    Hafizh Vito
                  </h3>
                  <span className="text-xs font-medium text-ink-soft">
                    Founder & Lead Technical Advisor
                  </span>
                </div>
              </div>
              <p className="text-xs text-ink-soft leading-relaxed">
                Originated the advisory practice. Focuses on Luau system design, DataStore reliability, player retention loops, and mathematical economy models.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7FAF8] border border-ink/15 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-mint border border-ink/15 flex items-center justify-center font-display font-bold text-ink">
                  R
                </div>
                <div>
                  <h3 className="font-display text-lg text-ink font-bold leading-tight">
                    Rainer
                  </h3>
                  <span className="text-xs font-medium text-ink-soft">
                    Co-Founder & Systems Partner
                  </span>
                </div>
              </div>
              <p className="text-xs text-ink-soft leading-relaxed">
                Focuses on engine performance profiling, network remote throttlers, custom tool engineering, and milestone technical execution.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-ink/10 flex flex-wrap items-center gap-3 text-xs text-ink-soft">
            <span className="font-semibold text-ink uppercase tracking-wider text-[11px]">Core Standards:</span>
            <span className="px-2.5 py-1 rounded-lg bg-cream border border-ink/10">Strict Typed Luau</span>
            <span className="px-2.5 py-1 rounded-lg bg-cream border border-ink/10">Roblox Studio Profiler</span>
            <span className="px-2.5 py-1 rounded-lg bg-cream border border-ink/10">Mutual NDA Protection</span>
            <span className="px-2.5 py-1 rounded-lg bg-cream border border-ink/10">Fixed Scope Invoices</span>
            <span className="px-2.5 py-1 rounded-lg bg-cream border border-ink/10">In-House Web Engineering</span>
          </div>
        </div>
      </Section>

      {/* ── CALL TO ACTION STRIP ── */}
      <Section background="cream">
        <div className="bg-ink text-cream rounded-3xl p-8 sm:p-12 md:p-16 border border-ink relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="inline-block px-3 py-1 rounded-full bg-peach text-ink text-xs font-semibold">
              Ready to build?
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-cream tracking-tight leading-tight">
              Let us review your game concept or codebase.
            </h2>
            <p className="text-cream/80 text-sm sm:text-base leading-relaxed">
              Tell us about your target launch date, where you are getting stuck, and what you need. We respond within two business days with honest advice.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Button href="/contact" variant="peach" size="lg">
                Send an Inquiry
              </Button>
              <Button href="/packages" variant="secondary" size="lg">
                View Pricing Packages
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </AppLayout>
  );
}
