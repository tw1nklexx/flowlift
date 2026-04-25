"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  X,
  Menu,
  Zap,
  Target,
  Paintbrush2,
  BarChart2,
  Sparkles,
  Code2,
  TrendingDown,
  TrendingUp,
  LayoutDashboard,
  HelpCircle,
  LogOut,
  CheckCircle2,
  Users,
} from "lucide-react";
import PricingSection from "./PricingSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#111827] antialiased">
      <Nav />
      <Hero />
      <SocialProof />
      <Features />
      <BeforeAfter />
      <HowItWorks />
      <ComparisonTable />
      <Testimonial />
      <PricingSection />
      <FinalCta />
      <Footer />
    </div>
  );
}

/* ── Navigation ──────────────────────────────────────────────────────────── */

function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-[#4f6ef7] shrink-0">
          Nudgify
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          <Link href="#features" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
            How it works
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
            Pricing
          </Link>
          <Link href="/compare" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
            Compare
          </Link>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold bg-[#4f6ef7] text-white px-5 py-2 rounded-full hover:bg-[#3b5af5] hover:scale-105 transition-all shadow-sm shadow-blue-200"
          >
            Start free
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-lg"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-0.5">
          {["Features", "How it works", "Pricing"].map((label) => (
            <Link
              key={label}
              href={`#${label.toLowerCase().replace(" ", "-")}`}
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-gray-700 hover:text-gray-900 py-2.5 border-b border-gray-50"
            >
              {label}
            </Link>
          ))}
          <Link href="/compare" onClick={() => setOpen(false)} className="block text-sm font-medium text-gray-700 hover:text-gray-900 py-2.5 border-b border-gray-50">
            Compare
          </Link>
          <div className="pt-3 flex flex-col gap-2">
            <Link href="/login" className="text-center text-sm font-medium text-gray-700 border border-gray-200 py-2.5 rounded-full hover:bg-gray-50 transition-colors">
              Sign in
            </Link>
            <Link href="/signup" className="text-center text-sm font-semibold bg-[#4f6ef7] text-white py-2.5 rounded-full hover:bg-[#3b5af5] transition-colors">
              Start free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-14 pb-16 px-6 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-brand-100/50 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-brand-50 text-[#4f6ef7] text-xs font-semibold px-3.5 py-1.5 rounded-full mb-8 border border-brand-100">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4f6ef7] animate-pulse" />
          In-app onboarding without the developer
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#111827] leading-[1.05] tracking-tight mb-6">
          Turn signups into<br />
          <span className="text-[#4f6ef7]">activated customers</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-4 leading-relaxed">
          Add personalized onboarding flows to your SaaS in 10 minutes.
          No developer changes needed after the initial setup.
        </p>

        {/* Power line */}
        <p className="text-sm text-gray-400 mb-10">
          Users who complete onboarding are{" "}
          <strong className="text-[#4f6ef7] font-semibold">2–3× more likely</strong>{" "}
          to become paying customers.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
          <Link
            href="/signup"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#4f6ef7] text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-[#3b5af5] hover:scale-105 transition-all shadow-lg shadow-blue-200"
          >
            Start for free
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-600 px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            See how it works
          </a>
        </div>

        {/* Micro-proof */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-16 flex-wrap">
          <span className="flex items-center gap-1">
            <Zap size={11} className="text-[#4f6ef7]" />
            Free to start
          </span>
          <span className="text-gray-200">·</span>
          <span>No credit card required</span>
          <span className="text-gray-200">·</span>
          <span>Setup in 10 minutes</span>
        </div>

        {/* Browser mockup */}
        <div className="relative max-w-2xl mx-auto">
          {/* Glow behind mockup */}
          <div className="absolute -inset-8 bg-gradient-to-r from-brand-300/25 via-purple-300/15 to-brand-300/25 rounded-[40px] blur-2xl" />

          <div className="relative bg-[#0f0f13] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/5">
            {/* Title bar */}
            <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-900/80 border-b border-white/5">
              <span className="w-3 h-3 rounded-full bg-red-400/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
              <span className="w-3 h-3 rounded-full bg-green-400/70" />
              <div className="flex-1 flex justify-center">
                <span className="text-xs text-gray-500 font-mono bg-white/5 px-4 py-0.5 rounded-md">
                  app.yourproduct.com
                </span>
              </div>
            </div>

            {/* App skeleton + Nudgify modal */}
            <div className="p-5 text-left">
              <div className="flex gap-4">
                {/* Fake sidebar */}
                <div className="w-28 shrink-0 space-y-2 pt-1">
                  <div className="h-3 w-20 bg-white/10 rounded" />
                  <div className="h-2.5 w-14 bg-white/6 rounded" />
                  <div className="h-2.5 w-16 bg-white/6 rounded" />
                  <div className="h-2.5 w-12 bg-white/6 rounded" />
                  <div className="mt-3 h-2.5 w-20 bg-brand-600/25 rounded" />
                  <div className="h-2.5 w-16 bg-white/6 rounded" />
                </div>
                {/* Fake main content */}
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-14 bg-white/5 rounded-lg border border-white/5" />
                    <div className="h-14 bg-white/5 rounded-lg border border-white/5" />
                    <div className="h-14 bg-white/5 rounded-lg border border-white/5" />
                  </div>
                  <div className="h-2 w-3/4 bg-white/6 rounded" />
                  <div className="h-2 w-1/2 bg-white/6 rounded" />
                </div>
              </div>

              {/* Nudgify welcome modal overlay */}
              <div className="mt-4 relative">
                <div className="absolute inset-0 bg-black/30 rounded-xl" />
                <div className="relative mx-auto max-w-xs bg-white rounded-2xl p-5 shadow-2xl">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="shrink-0 w-8 h-8 rounded-xl bg-brand-50 flex items-center justify-center">
                      <Sparkles size={14} className="text-[#4f6ef7]" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-gray-900 leading-snug">Welcome to your dashboard! 👋</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Let us show you around in 2 minutes.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold bg-[#4f6ef7] text-white px-3 py-1.5 rounded-full cursor-pointer">
                      Show me →
                    </span>
                    <span className="text-[11px] text-gray-400 cursor-pointer">Skip for now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Social Proof ────────────────────────────────────────────────────────── */

function SocialProof() {
  const stats = [
    { value: "2×", label: "activation rate" },
    { value: "10 min", label: "setup time" },
    { value: "< $0.01", label: "per user" },
  ];

  return (
    <div className="py-10 px-6 border-y border-gray-100 bg-gray-50/60">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="text-sm text-gray-400 font-medium text-center sm:text-left">
          Built for founders who can&apos;t afford $300/mo onboarding tools
        </p>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm"
            >
              <span className="text-sm font-bold text-[#4f6ef7]">{s.value}</span>
              <span className="text-xs text-gray-500">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Features ────────────────────────────────────────────────────────────── */

const FEATURES = [
  {
    emoji: "🎨",
    title: "Visual flow builder",
    body: "Build modals, tooltips, and banners with a click. No design skills required. Preview instantly before publishing.",
  },
  {
    emoji: "🎯",
    title: "Smart targeting",
    body: "Show flows based on user plan, current URL, session count, or idle time. Per-condition AND/OR logic.",
  },
  {
    emoji: "⚡",
    title: "Tiny snippet",
    body: "Under 10KB, loads async. Zero impact on your app's Lighthouse score or rendering performance.",
  },
  {
    emoji: "🤖",
    title: "AI flow generator",
    body: "Describe what you want in plain English. AI builds the full multi-step flow for you in seconds.",
  },
  {
    emoji: "📊",
    title: "Drop-off analytics",
    body: "See exactly where users quit your onboarding. Know which steps work and which need fixing.",
  },
  {
    emoji: "🔧",
    title: "Any framework",
    body: "React, Vue, Angular, plain HTML — it doesn't matter. One script tag. Your dev does it once and never again.",
  },
];

function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-[#4f6ef7] mb-3">Everything you need</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] mb-4">
            Onboarding that actually works
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Everything an Appcues or Pendo customer gets — without the enterprise price tag.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default"
            >
              <div className="text-2xl mb-4">{f.emoji}</div>
              <h3 className="text-base font-bold text-[#111827] mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Before / After ──────────────────────────────────────────────────────── */

function BeforeAfter() {
  const withoutItems = [
    { icon: <LayoutDashboard size={14} />, text: "Users land on an empty dashboard" },
    { icon: <HelpCircle size={14} />, text: "No idea where to start — no guidance" },
    { icon: <LogOut size={14} />, text: "They leave and never come back" },
    { icon: <TrendingDown size={14} />, text: "70% churn in week one" },
  ];

  const withItems = [
    { icon: <Sparkles size={14} />, text: "Personalized welcome flow greets them instantly" },
    { icon: <Target size={14} />, text: "Guided to their first key action in 2 minutes" },
    { icon: <CheckCircle2 size={14} />, text: "They get value on day one — they stay" },
    { icon: <TrendingUp size={14} />, text: "2× activation rate within a week" },
  ];

  return (
    <section className="py-24 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-[#4f6ef7] mb-3">The difference</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] mb-4">
            What happens without onboarding
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            First impressions are permanent. Most SaaS products lose half their signups in the first session.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Without */}
          <div className="bg-red-50 border border-red-100 rounded-2xl p-7">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-red-400" />
              </span>
              <h3 className="font-bold text-red-900 text-sm">Without Nudgify</h3>
            </div>
            <ul className="space-y-3.5">
              {withoutItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="shrink-0 mt-0.5 w-6 h-6 rounded-lg bg-red-100 flex items-center justify-center text-red-400">
                    {item.icon}
                  </span>
                  <span className="text-sm text-red-800 leading-snug">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* With */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-7">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </span>
              <h3 className="font-bold text-emerald-900 text-sm">With Nudgify</h3>
            </div>
            <ul className="space-y-3.5">
              {withItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="shrink-0 mt-0.5 w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                    {item.icon}
                  </span>
                  <span className="text-sm text-emerald-900 leading-snug">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── How It Works ────────────────────────────────────────────────────────── */

function HowItWorks() {
  const steps = [
    {
      icon: <Code2 size={20} />,
      step: "01",
      title: "Paste one script tag",
      description:
        "Add a single async snippet before your closing </body> tag. Works with React, Vue, Angular, or plain HTML. Your dev does it once.",
    },
    {
      icon: <Paintbrush2 size={20} />,
      step: "02",
      title: "Build your flow",
      description:
        "Use the visual builder to create modals, tooltips, and banners. Set targeting rules and preview instantly — no deploys needed.",
    },
    {
      icon: <BarChart2 size={20} />,
      step: "03",
      title: "Watch users convert",
      description:
        "Track impressions, completions, and drop-off in real-time. Know which steps work and which need improving.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-[#4f6ef7] mb-3">Up and running fast</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] mb-4">
            Three steps to better activation
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            No SDKs to configure. No design system to integrate with. Just results.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid md:grid-cols-3 gap-8 mb-16">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-9 left-[calc(16.67%+20px)] right-[calc(16.67%+20px)] h-px bg-gradient-to-r from-brand-200 via-brand-300 to-brand-200" />

          {steps.map((s) => (
            <div
              key={s.step}
              className="relative bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="relative z-10 flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 text-[#4f6ef7] shrink-0 ring-4 ring-white">
                  {s.icon}
                </span>
                <span className="text-xs font-bold text-[#4f6ef7] bg-brand-50 px-2.5 py-1 rounded-md">
                  Step {s.step}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#111827] mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>

        {/* Code snippet */}
        <div className="max-w-xl mx-auto bg-[#0f0f13] rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/5">
          <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-900/80 border-b border-white/5">
            <span className="w-3 h-3 rounded-full bg-red-400/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
            <span className="w-3 h-3 rounded-full bg-green-400/70" />
            <span className="ml-3 text-xs text-gray-500 font-mono">index.html</span>
          </div>
          <pre className="p-5 text-sm font-mono overflow-x-auto leading-relaxed">
            <code>
              <span className="text-gray-500">{`<!-- Paste before </body> — one time only -->\n`}</span>
              <span className="text-blue-400">{`<script`}</span>
              <span className="text-green-400">{` src`}</span>
              <span className="text-white">{`=`}</span>
              <span className="text-yellow-300">{`"https://cdn.nudgify.app/snippet.js"`}</span>
              <span className="text-blue-400">{` async></script>\n`}</span>
              <span className="text-blue-400">{`<script>\n`}</span>
              <span className="text-white">{`  Nudgify`}</span>
              <span className="text-blue-400">{`.`}</span>
              <span className="text-green-300">{`init`}</span>
              <span className="text-white">{`(`}</span>
              <span className="text-yellow-300">{`"proj_xxxxxxxxxxxx"`}</span>
              <span className="text-white">{`);\n`}</span>
              <span className="text-white">{`  Nudgify`}</span>
              <span className="text-blue-400">{`.`}</span>
              <span className="text-green-300">{`identify`}</span>
              <span className="text-white">{`({ plan: user.plan });\n`}</span>
              <span className="text-blue-400">{`</script>`}</span>
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}

/* ── Comparison Table ────────────────────────────────────────────────────── */

type CellValue = string | boolean;

const COMPARISON_ROWS: { label: string; nudgify: CellValue; appcues: CellValue; pendo: CellValue }[] = [
  { label: "Starting price",    nudgify: "Free",       appcues: "$249/mo",   pendo: "$7,000+/yr" },
  { label: "No-code builder",   nudgify: true,         appcues: true,        pendo: true          },
  { label: "AI flow generator", nudgify: true,         appcues: false,       pendo: false         },
  { label: "Snippet size",      nudgify: "< 10 KB",    appcues: "~150 KB",   pendo: "~200 KB"     },
  { label: "Setup time",        nudgify: "10 minutes", appcues: "2–3 days",  pendo: "1+ week"     },
  { label: "Analytics",         nudgify: true,         appcues: true,        pendo: true          },
  { label: "Built for",         nudgify: "Founders",   appcues: "Mid-market",pendo: "Enterprise"  },
];

function Cell({ value, highlight }: { value: CellValue; highlight?: boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${highlight ? "bg-white/20" : "bg-emerald-50"}`}>
        <Check size={13} className={highlight ? "text-white" : "text-emerald-600"} strokeWidth={2.5} />
      </span>
    ) : (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100">
        <X size={13} className="text-gray-400" strokeWidth={2.5} />
      </span>
    );
  }
  return (
    <span className={`text-sm font-medium ${highlight ? "text-white" : "text-gray-700"}`}>
      {value}
    </span>
  );
}

function ComparisonTable() {
  return (
    <section className="py-24 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#4f6ef7] mb-3">Honest comparison</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] mb-4">
            How we stack up
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Nudgify is built for early-stage founders, not enterprise procurement teams.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-4 border-b border-gray-100">
            <div className="p-5 col-span-1" />
            <div className="p-5 text-center border-l border-gray-100">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Appcues</span>
            </div>
            <div className="p-5 text-center bg-[#4f6ef7] border-l border-[#4f6ef7]/20">
              <span className="text-xs font-bold text-white uppercase tracking-wide">Nudgify</span>
              <div className="mt-0.5 text-[10px] text-blue-200 font-medium">← you are here</div>
            </div>
            <div className="p-5 text-center border-l border-gray-100">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pendo</span>
            </div>
          </div>

          {/* Rows */}
          {COMPARISON_ROWS.map((row, i) => (
            <div
              key={row.label}
              className={`grid grid-cols-4 ${i < COMPARISON_ROWS.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              <div className="p-4 flex items-center">
                <span className="text-sm text-gray-600 font-medium">{row.label}</span>
              </div>
              <div className="p-4 flex items-center justify-center border-l border-gray-100">
                <Cell value={row.appcues} />
              </div>
              <div className="p-4 flex items-center justify-center bg-[#4f6ef7]/5 border-l border-[#4f6ef7]/10">
                <Cell value={row.nudgify} highlight />
              </div>
              <div className="p-4 flex items-center justify-center border-l border-gray-100">
                <Cell value={row.pendo} />
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Appcues and Pendo prices as of 2026. Nudgify pricing always at{" "}
          <a href="#pricing" className="text-[#4f6ef7] hover:underline">nudgify.app/pricing</a>.
        </p>
      </div>
    </section>
  );
}

/* ── Testimonial ─────────────────────────────────────────────────────────── */

function Testimonial() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#0f0f13] rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-brand-600/20 rounded-full blur-3xl" />

          <div className="relative">
            {/* Stars */}
            <div className="flex items-center justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            <blockquote className="text-xl sm:text-2xl font-semibold text-white leading-snug mb-8 max-w-xl mx-auto">
              &ldquo;We cut day-1 churn by 40% in the first week. Setup took less than an afternoon — and our users finally know what to do when they land.&rdquo;
            </blockquote>

            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                A
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-white">Alex M.</p>
                <p className="text-xs text-gray-400">Founder, DataPipe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Final CTA ───────────────────────────────────────────────────────────── */

function FinalCta() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-[#4f6ef7] via-indigo-600 to-purple-600 rounded-3xl px-8 py-14 sm:px-14 text-center">
          <div className="flex items-center justify-center gap-2 mb-5">
            <Users size={18} className="text-blue-200" />
            <span className="text-sm text-blue-200 font-medium">Free forever on your first 500 MAU</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            Ready to stop losing users<br className="hidden sm:block" /> on day one?
          </h2>
          <p className="text-blue-200 mb-10 text-base">
            Set up in 10 minutes. No credit card required. Cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 bg-white text-[#4f6ef7] px-8 py-3.5 rounded-full text-sm font-bold hover:bg-blue-50 hover:scale-105 transition-all shadow-lg shadow-black/10"
            >
              Start for free
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-blue-200 hover:text-white transition-colors px-4 py-3.5"
            >
              See pricing →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────────────────────── */

function Footer() {
  const cols = [
    {
      heading: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "How it works", href: "#how-it-works" },
        { label: "Compare", href: "/compare" },
      ],
    },
    {
      heading: "Developers",
      links: [
        { label: "Documentation", href: "/docs" },
        { label: "Snippet reference", href: "/docs/snippet" },
        { label: "API reference", href: "/docs/api" },
        { label: "Changelog", href: "/changelog" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ],
    },
    {
      heading: "Account",
      links: [
        { label: "Sign in", href: "/login" },
        { label: "Sign up free", href: "/signup" },
        { label: "Dashboard", href: "/flows" },
        { label: "Settings", href: "/settings" },
      ],
    },
  ];

  return (
    <footer className="bg-[#0f0f13] px-6 pt-16 pb-8">
      <div className="max-w-6xl mx-auto">
        {/* Top: logo + columns */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-xl font-bold text-white block mb-3">
              Nudgify
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Lightweight onboarding for SaaS founders who move fast.
            </p>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                {col.heading}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-gray-200 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © 2026 Nudgify. Built for SaaS founders.
          </p>
          <p className="text-xs text-gray-600">
            Lighter than Appcues. Cheaper than Pendo. Ships today.
          </p>
        </div>
      </div>
    </footer>
  );
}
