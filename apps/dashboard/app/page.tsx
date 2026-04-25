import Link from "next/link";
import {
  ClipboardList,
  Paintbrush2,
  TrendingUp,
  TrendingDown,
  Zap,
  HelpCircle,
  LogOut,
  Sparkles,
  Target,
  CheckCircle2,
  LayoutDashboard,
  Users,
  ArrowRight,
} from "lucide-react";
import PricingSection from "./PricingSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Nav />
      <Hero />
      <SocialProof />
      <BeforeAfter />
      <HowItWorks />
      <PricingSection />
      <FinalCta />
      <Footer />
    </div>
  );
}

/* ── Navigation ─────────────────────────────────────────────────────────── */

function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[#4f6ef7]">
          FlowLift
        </Link>
        <nav className="flex items-center gap-2">
          <a
            href="#pricing"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-3 py-1.5 hidden sm:block"
          >
            Pricing
          </a>
          <Link
            href="/docs"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-3 py-1.5 hidden sm:block"
          >
            Docs
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-1.5"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold bg-[#4f6ef7] text-white px-4 py-1.5 rounded-lg hover:bg-[#3b5af5] transition-colors"
          >
            Start free
          </Link>
        </nav>
      </div>
    </header>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-50 text-[#4f6ef7] text-xs font-semibold px-3 py-1.5 rounded-full mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4f6ef7] animate-pulse" />
          In-app onboarding without the developer
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6">
          Turn confused users into
          <br />
          <span className="text-[#4f6ef7]">activated customers</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Add personalized onboarding to your SaaS in 10 minutes.
          No developers needed after setup. Cancel anytime.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <Link
            href="/signup"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#4f6ef7] text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-[#3b5af5] transition-colors shadow-sm shadow-blue-200"
          >
            Start for free
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto border border-gray-200 text-gray-600 px-8 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            See how it works
          </a>
        </div>

        {/* Trust line */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mb-16">
          <Zap size={12} className="text-[#4f6ef7]" />
          <span>Free to start</span>
          <span className="mx-1">·</span>
          <span>No credit card required</span>
          <span className="mx-1">·</span>
          <span>Setup in 10 minutes</span>
        </div>

        {/* Code preview */}
        <div className="max-w-xl mx-auto bg-gray-900 rounded-2xl overflow-hidden shadow-2xl shadow-gray-200 text-left ring-1 ring-gray-800">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-700/50 bg-gray-800/50">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-3 text-xs text-gray-500 font-mono">index.html</span>
          </div>
          <pre className="p-5 text-sm font-mono overflow-x-auto leading-relaxed">
            <code>
              <span className="text-gray-500">{`<!-- Drop this before </body> -->\n`}</span>
              <span className="text-blue-400">{`<script`}</span>
              <span className="text-green-400">{` src`}</span>
              <span className="text-white">{`=`}</span>
              <span className="text-yellow-300">{`"your-domain.com/snippet"`}</span>
              <span className="text-blue-400">{`></script>\n`}</span>
              <span className="text-blue-400">{`<script>\n`}</span>
              <span className="text-white">{`  FlowLift`}</span>
              <span className="text-blue-400">{`.`}</span>
              <span className="text-green-300">{`init`}</span>
              <span className="text-white">{`(`}</span>
              <span className="text-yellow-300">{`"proj_xxxxxxxxxxxx"`}</span>
              <span className="text-white">{`);\n`}</span>
              <span className="text-white">{`  FlowLift`}</span>
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

/* ── Social Proof ────────────────────────────────────────────────────────── */

function SocialProof() {
  const stats = [
    { value: "2x", label: "activation rate" },
    { value: "10 min", label: "setup time" },
    { value: "< $0.01", label: "per user" },
  ];

  return (
    <div className="py-10 px-6 border-y border-gray-100 bg-gray-50/50">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="text-sm font-medium text-gray-500 text-center sm:text-left">
          Join founders who stopped losing users on day one
        </p>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2"
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

/* ── Before / After ──────────────────────────────────────────────────────── */

function BeforeAfter() {
  const withoutItems = [
    { icon: <LayoutDashboard size={15} />, text: "Users land on an empty dashboard" },
    { icon: <HelpCircle size={15} />, text: "No idea where to start" },
    { icon: <LogOut size={15} />, text: "They leave. Never come back." },
    { icon: <TrendingDown size={15} />, text: "70% churn in week 1" },
  ];

  const withItems = [
    { icon: <Sparkles size={15} />, text: "Personalized welcome flow greets them" },
    { icon: <Target size={15} />, text: "Guided to their first key action" },
    { icon: <CheckCircle2 size={15} />, text: "They get value. They stay." },
    { icon: <TrendingUp size={15} />, text: "2x activation rate" },
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            What happens without onboarding
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            First impressions are permanent. Most SaaS products lose half their signups in the first session.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Without */}
          <div className="bg-red-50 border border-red-100 rounded-2xl p-7">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-red-400" />
              </span>
              <h3 className="font-bold text-red-900">Without FlowLift</h3>
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
            <div className="flex items-center gap-2 mb-5">
              <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </span>
              <h3 className="font-bold text-emerald-900">With FlowLift</h3>
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
      icon: <ClipboardList size={22} />,
      step: "01",
      title: "Paste one line of code",
      description:
        "Add a single script tag to your app. Works with React, Vue, Angular, or plain HTML. Your dev does it once and never touches it again.",
    },
    {
      icon: <Paintbrush2 size={22} />,
      step: "02",
      title: "Build your flow",
      description:
        "Use the visual builder to create modals, tooltips, and banners. Set targeting rules — show different flows based on user plan, URL, or session count.",
    },
    {
      icon: <TrendingUp size={22} />,
      step: "03",
      title: "Watch users convert",
      description:
        "Track impressions, completions, and drop-off per flow. Know exactly which onboarding steps are working and which aren't.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Up and running in minutes
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            No SDKs to configure. No design system to integrate with. Just results.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div
              key={s.step}
              className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 text-brand-600 shrink-0">
                  {s.icon}
                </span>
                <span className="text-xs font-bold text-[#4f6ef7] bg-blue-50 px-2.5 py-1 rounded-md">
                  Step {s.step}
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Final CTA strip ─────────────────────────────────────────────────────── */

function FinalCta() {
  return (
    <section className="py-20 px-6 bg-[#4f6ef7]">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-5">
          <Users size={20} className="text-blue-200" />
          <span className="text-sm text-blue-200 font-medium">Free forever on your first 500 users</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
          Ready to stop losing users on day one?
        </h2>
        <p className="text-blue-200 mb-8">
          Set up in 10 minutes. No credit card required.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 bg-white text-[#4f6ef7] px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors shadow-sm"
        >
          Start for free
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
          <span className="text-base font-bold text-[#4f6ef7]">FlowLift</span>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
              Home
            </Link>
            <Link href="/docs" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
              Docs
            </Link>
            <a href="#pricing" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
              Pricing
            </a>
            <Link href="/login" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
              Sign in
            </Link>
          </nav>
        </div>
        <div className="border-t border-gray-200 pt-5 text-center sm:text-left">
          <p className="text-xs text-gray-400">
            © 2026 FlowLift. Built for SaaS founders.
          </p>
        </div>
      </div>
    </footer>
  );
}
