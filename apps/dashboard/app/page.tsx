"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  X,
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
import SharedPublicLayout from "@/components/SharedPublicLayout";
import { AnimatedHeroMockup } from "@/components/AnimatedHeroMockup";
import PricingSection from "./PricingSection";

export default function LandingPage() {
  return (
    <SharedPublicLayout>
      <Hero />
      <SocialProof />
      <Features />
      <BeforeAfter />
      <HowItWorks />
      <ComparisonSection />
      <Testimonial />
      <PricingSection />
      <FinalCta />
    </SharedPublicLayout>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-14 px-6 pb-10 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[700px] h-[500px] bg-gradient-to-br from-brand-100/60 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* ── Left: text ── */}
          <div className="text-center lg:text-left pt-16 lg:pt-0">
            {/* Label */}
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-4">
              For SaaS founders
            </p>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111827] leading-[1.05] tracking-tight mb-4">
              Turn signups into<br />
              <span className="text-[#4f6ef7]">activated customers</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-gray-500 mb-3 leading-relaxed">
              Add personalized onboarding flows to your SaaS in 10 minutes.
              No developer changes after the initial setup.
            </p>

            {/* Power line */}
            <p className="text-sm text-gray-400 mb-8">
              Users who complete onboarding are{" "}
              <strong className="text-[#4f6ef7] font-semibold">2–3× more likely</strong>{" "}
              to become paying customers.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-3 mb-4">
              <Link
                href="/signup"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#4f6ef7] text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-[#3b5af5] hover:scale-105 transition-all shadow-lg shadow-blue-200 cursor-pointer"
              >
                Start for free
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-600 px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer"
              >
                See how it works
              </a>
            </div>

            {/* Micro-proof */}
            <div className="flex items-center lg:justify-start justify-center gap-2 text-xs text-gray-400 flex-wrap">
              <span className="flex items-center gap-1">
                <Zap size={11} className="text-[#4f6ef7]" />
                Free to start
              </span>
              <span className="text-gray-200">·</span>
              <span>No credit card required</span>
              <span className="text-gray-200">·</span>
              <span>Setup in 10 minutes</span>
            </div>
          </div>

          {/* ── Right: animated mockup ── */}
          <AnimatedHeroMockup />

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

/* ── Comparison Section (replaces table) ─────────────────────────────────── */

function ComparisonSection() {
  const tools = [
    {
      name: "Appcues",
      price: "$300+/mo",
      setup: "Days to setup",
      plan: "No free plan",
      highlight: false,
    },
    {
      name: "Nudgify",
      price: "From $29/mo",
      setup: "10 min setup",
      plan: "Free plan included",
      highlight: true,
    },
    {
      name: "Pendo",
      price: "$700+/mo",
      setup: "Weeks to setup",
      plan: "Enterprise only",
      highlight: false,
    },
  ];

  return (
    <section className="py-24 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#4f6ef7] mb-3">Honest comparison</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] mb-4">
            Built for a different stage
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Nudgify is for founders at 0–50K MAU, not enterprise procurement teams.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {tools.map((t) => (
            <div
              key={t.name}
              className={`rounded-2xl p-6 text-center flex flex-col items-center gap-1 transition-all ${
                t.highlight
                  ? "bg-[#4f6ef7] text-white shadow-xl shadow-blue-200 md:scale-105"
                  : "bg-white border border-gray-200"
              }`}
            >
              {t.highlight && (
                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 text-white px-2 py-0.5 rounded-full mb-1">
                  Most popular
                </span>
              )}
              <p className={`text-lg font-bold mb-2 ${t.highlight ? "text-white" : "text-gray-900"}`}>
                {t.name}
              </p>
              <p className={`text-sm font-semibold ${t.highlight ? "text-white" : "text-[#4f6ef7]"}`}>
                {t.price}
              </p>
              <p className={`text-xs ${t.highlight ? "text-blue-200" : "text-gray-500"}`}>{t.setup}</p>
              <p className={`text-xs ${t.highlight ? "text-blue-200" : "text-gray-500"}`}>{t.plan}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#4f6ef7] hover:text-[#3b5af5] transition-colors"
          >
            See full feature-by-feature comparison
            <ArrowRight size={14} />
          </Link>
        </div>
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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-brand-600/20 rounded-full blur-3xl" />
          <div className="relative">
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
              className="group inline-flex items-center gap-2 bg-white text-[#4f6ef7] px-8 py-3.5 rounded-full text-sm font-bold hover:bg-blue-50 hover:scale-105 transition-all shadow-lg shadow-black/10 cursor-pointer"
            >
              Start for free
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/#pricing"
              className="text-sm font-medium text-blue-200 hover:text-white transition-colors px-4 py-3.5 cursor-pointer"
            >
              See pricing →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
