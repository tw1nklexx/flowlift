import Link from "next/link";
import { Check, X, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Why Nudgify — Comparison with Appcues, Pendo & DIY",
  description:
    "An honest breakdown of how Nudgify compares to Appcues, Pendo, and building it yourself. Built for early-stage SaaS founders.",
};

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Nav />

      {/* offset for fixed nav */}
      <div className="pt-14">
        <Hero />
        <WhoItsFor />
        <Objections />
        <ComparisonTable />
        <HonestPitch />
        <Faq />
        <Footer />
      </div>
    </div>
  );
}

/* ── Nav ─────────────────────────────────────────────────────────────────── */

function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[#4f6ef7]">
          Nudgify
        </Link>
        <div className="flex items-center gap-1">
          <Link href="/#pricing" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer px-2 py-2 hidden sm:block">
            Pricing
          </Link>
          <Link href="/compare" className="text-sm font-medium text-[#4f6ef7] cursor-pointer px-2 py-2 hidden sm:block">
            Compare
          </Link>
          <Link href="/docs" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer px-2 py-2 hidden sm:block">
            Docs
          </Link>
          <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer px-2 py-2 text-sm">
            Sign in
          </Link>
          <Link href="/signup" className="text-sm font-semibold bg-[#4f6ef7] text-white px-4 py-2 rounded-lg hover:bg-[#3b5af5] transition-colors cursor-pointer ml-1">
            Start free
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ── Section 1: Hero ─────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="py-20 px-6 border-b border-gray-100">
      <div className="max-w-3xl mx-auto text-center">
        <span className="inline-flex items-center gap-2 bg-blue-50 text-[#4f6ef7] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          Honest comparison
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-5">
          Why founders choose Nudgify over Appcues, Pendo, and DIY
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          We&apos;re not the biggest. We&apos;re built for a different stage.
        </p>
      </div>
    </section>
  );
}

/* ── Section 2: Who it's for ─────────────────────────────────────────────── */

function WhoItsFor() {
  const goodFit = [
    "You're a SaaS founder with 0–10K users",
    'You want to improve activation without hiring a growth engineer',
    'You\'ve looked at Appcues and thought "$300/mo for THIS?"',
    "Your developer is busy and can't build onboarding from scratch",
    "You want to see results in days, not months",
  ];
  const badFit = [
    "You need enterprise SSO and compliance reports",
    "You have a dedicated growth team with complex A/B testing needs",
    "You need deep CRM integrations out of the box",
  ];

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Nudgify is built for you if…</h2>
          <p className="text-gray-500">We're specific about who we're a good fit for. Honest mismatch saves everyone time.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Good fit */}
          <div className="bg-white rounded-2xl border border-emerald-100 p-7">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-5">Good fit</p>
            <ul className="space-y-4">
              {goodFit.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                    <Check size={11} className="text-emerald-600" strokeWidth={3} />
                  </span>
                  <span className="text-sm text-gray-700 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Not for */}
          <div className="bg-white rounded-2xl border border-gray-200 p-7">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">Not for you if</p>
            <ul className="space-y-4">
              {badFit.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                    <X size={11} className="text-gray-400" strokeWidth={3} />
                  </span>
                  <span className="text-sm text-gray-500 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-gray-400 leading-relaxed border-t border-gray-100 pt-5">
              If any of these fit, Appcues or Pendo are genuinely better options at that scale. We&apos;d rather you use the right tool.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Section 3: Objections ───────────────────────────────────────────────── */

const OBJECTIONS = [
  {
    q: "Is it really that easy to set up?",
    a: "Two lines of code. That's it. Your developer pastes a script tag once — after that you manage everything from the dashboard. No deployments. No pull requests. No waiting.",
  },
  {
    q: "What if I outgrow it?",
    a: "Our Pro plan handles 50K MAU. If you're at 50K users you have real revenue and can afford Appcues. We're honest about this — we're built for the 0–50K stage, and we're really good at it.",
  },
  {
    q: "Will it slow down my app?",
    a: "The snippet is under 12KB and loads async. It has zero impact on your Core Web Vitals. Unlike some tools, it doesn't load from a third-party CDN that ad blockers flag — it loads from your own domain.",
  },
  {
    q: "What if my users see something broken?",
    a: "Flows only show when explicitly triggered. If something goes wrong, you can unpublish in one click. No code deploy needed.",
  },
  {
    q: "Is my data safe?",
    a: "All data is stored in isolated Supabase instances. Each project has its own API key. No data is shared between accounts. We never sell or share user data.",
  },
  {
    q: "What if I need features you don't have?",
    a: "Tell us. We're a small team and we ship fast. Features that matter to real customers get built. Email us at hello@nudgify.app",
  },
];

function Objections() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">The real objections — and honest answers</h2>
          <p className="text-gray-500">Things you&apos;re probably wondering before you sign up.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {OBJECTIONS.map(({ q, a }) => (
            <div key={q} className="bg-white border border-gray-200 rounded-2xl p-6">
              <p className="font-semibold text-gray-900 mb-3 leading-snug">{q}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Section 4: Comparison table ─────────────────────────────────────────── */

function ComparisonTable() {
  const cols = ["Nudgify", "Appcues", "Pendo", "DIY"];

  const rows: { feature: string; values: (string | boolean)[] }[] = [
    { feature: "Starting price",            values: ["$29/mo",      "$300/mo",    "$700/mo",   "$5,000+ one-time"] },
    { feature: "Setup time",                values: ["10 min",      "2–3 days",   "1 week",    "3–4 weeks"] },
    { feature: "No developer after setup",  values: [true,           false,        false,       false] },
    { feature: "AI flow generator",         values: [true,           false,        false,       false] },
    { feature: "Works with ad blockers",    values: [true,           false,        false,       true] },
    { feature: "Visual preview before publish", values: [true,       true,         true,        false] },
    { feature: "Free plan available",       values: [true,           false,        false,       true] },
    { feature: "Best for",                  values: ["0–50K MAU",   "10K–500K MAU", "Enterprise", "Any"] },
  ];

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Feature by feature</h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Same category. A different stage. A fraction of the price.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
          <table className="w-full min-w-[620px] border-collapse bg-white">
            <thead>
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider w-[220px] border-b border-gray-100">
                  Feature
                </th>
                {cols.map((col, i) => (
                  <th
                    key={col}
                    className={`px-5 py-4 text-sm font-bold text-center border-b ${
                      i === 0
                        ? "bg-[#4f6ef7] text-white border-[#3b5af5]"
                        : "text-gray-700 border-gray-100"
                    }`}
                  >
                    {col}
                    {i === 0 && (
                      <span className="ml-1.5 text-[10px] font-semibold bg-white/20 text-white px-1.5 py-0.5 rounded-full">
                        you
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={row.feature} className={ri % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
                  <td className="px-5 py-3.5 text-sm font-medium text-gray-700 border-b border-gray-50">
                    {row.feature}
                  </td>
                  {row.values.map((val, vi) => (
                    <td
                      key={vi}
                      className={`px-5 py-3.5 text-sm text-center border-b border-gray-50 ${
                        vi === 0 ? "bg-blue-50 font-semibold text-[#4f6ef7]" : "text-gray-500"
                      }`}
                    >
                      {typeof val === "boolean" ? (
                        val ? (
                          <Check size={16} className="mx-auto text-emerald-500" strokeWidth={2.5} />
                        ) : (
                          <X size={16} className="mx-auto text-red-300" strokeWidth={2.5} />
                        )
                      ) : (
                        val
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">
          Prices based on publicly available information. Competitor prices may vary.
        </p>
      </div>
    </section>
  );
}

/* ── Section 5: Honest pitch ─────────────────────────────────────────────── */

function HonestPitch() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-5">We&apos;re not trying to replace Appcues</h2>
        <p className="text-gray-500 leading-relaxed mb-5">
          Appcues is a great product for teams with budget and dedicated growth engineers. We&apos;re
          built for the stage before that — when you&apos;re scrappy, moving fast, and need onboarding
          that works without a $300/mo commitment or a week of setup.
        </p>
        <p className="text-gray-500 leading-relaxed mb-10">
          If you&apos;re at that stage, Nudgify is for you.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 bg-[#4f6ef7] text-white px-7 py-3.5 rounded-xl text-sm font-bold hover:bg-[#3b5af5] transition-colors shadow-sm shadow-blue-200"
        >
          Start free — no credit card required
          <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}

/* ── Section 6: FAQ ──────────────────────────────────────────────────────── */

const FAQS = [
  {
    q: "Can I migrate to Appcues later if I grow?",
    a: "Yes. The concepts are the same — flows, steps, targeting. You'll know exactly what you need when you get there.",
  },
  {
    q: "Do you offer annual plans?",
    a: "Yes — annual billing saves you 17%. Contact us at hello@nudgify.app to set it up.",
  },
  {
    q: "Is there a free trial?",
    a: "Our free plan is unlimited in time — 500 MAU and 1 flow, forever free. No trial period.",
  },
];

function Faq() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Quick questions</h2>
        <div className="space-y-6">
          {FAQS.map(({ q, a }) => (
            <div key={q} className="border-b border-gray-200 pb-6 last:border-0">
              <p className="font-semibold text-gray-900 mb-2">{q}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
          <span className="text-base font-bold text-[#4f6ef7]">Nudgify</span>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">Home</Link>
            <Link href="/compare" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">Compare</Link>
            <Link href="/docs" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">Docs</Link>
            <Link href="/#pricing" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">Pricing</Link>
            <Link href="/login" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">Sign in</Link>
          </nav>
        </div>
        <div className="border-t border-gray-200 pt-5 text-center sm:text-left">
          <p className="text-xs text-gray-400">© 2026 Nudgify. Built for SaaS founders.</p>
        </div>
      </div>
    </footer>
  );
}
