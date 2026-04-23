import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Nav />
      <Hero />
      <HowItWorks />
      <Pricing />
      <Footer />
    </div>
  );
}

/* ── Navigation ─────────────────────────────────────────────────────────── */

function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <span className="text-xl font-bold text-[#4f6ef7]">FlowLift</span>
        <Link
          href="/login"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </header>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-[#4f6ef7] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4f6ef7]" />
          No-code onboarding flows
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
          Personalized onboarding
          <br />
          <span className="text-[#4f6ef7]">for your SaaS</span>
        </h1>

        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Without the $300/mo price tag. Set up in 10 minutes,
          no developers needed after the first install.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <Link
            href="/signup"
            className="w-full sm:w-auto bg-[#4f6ef7] text-white px-7 py-3 rounded-xl text-sm font-semibold hover:bg-[#3b5af5] transition-colors shadow-sm"
          >
            Start for free
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto border border-gray-200 text-gray-600 px-7 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            See how it works
          </a>
        </div>

        {/* Code preview */}
        <div className="max-w-xl mx-auto bg-gray-900 rounded-2xl overflow-hidden shadow-2xl text-left">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-700/50">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-2 text-xs text-gray-500">index.html</span>
          </div>
          <pre className="p-5 text-sm font-mono overflow-x-auto">
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

/* ── How It Works ────────────────────────────────────────────────────────── */

function HowItWorks() {
  const steps = [
    {
      icon: "📋",
      step: "01",
      title: "Paste one line of code",
      description:
        "Add a single script tag to your app. Works with React, Vue, Angular, or plain HTML. Your dev does it once and never touches it again.",
    },
    {
      icon: "🎨",
      step: "02",
      title: "Build your flow",
      description:
        "Use the visual builder to create modals, tooltips, and banners. Set targeting rules — show different flows based on user plan, URL, or session count.",
    },
    {
      icon: "📈",
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
            <div key={s.step} className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{s.icon}</span>
                <span className="text-xs font-bold text-[#4f6ef7] bg-blue-50 px-2 py-1 rounded-md">
                  Step {s.step}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Pricing ─────────────────────────────────────────────────────────────── */

interface Plan {
  name: string;
  price: string;
  period?: string;
  mau: string;
  flows: string;
  analytics: string;
  support: string;
  popular?: boolean;
}

function Pricing() {
  const plans: Plan[] = [
    {
      name: "Free",
      price: "$0",
      mau: "500 MAU",
      flows: "1 flow",
      analytics: "Basic analytics",
      support: "Community support",
    },
    {
      name: "Starter",
      price: "$29",
      period: "/mo",
      mau: "10,000 MAU",
      flows: "Unlimited flows",
      analytics: "Full analytics",
      support: "Email support",
      popular: true,
    },
    {
      name: "Pro",
      price: "$79",
      period: "/mo",
      mau: "50,000 MAU",
      flows: "Unlimited flows",
      analytics: "Full analytics",
      support: "Priority support",
    },
  ];

  return (
    <section id="pricing" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Simple, honest pricing
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Start free. Upgrade when you need more users or flows.
            No contracts, cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          All plans include the embeddable snippet, flow builder, and analytics dashboard.
        </p>
      </div>
    </section>
  );
}

function PricingCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={`relative rounded-2xl p-7 flex flex-col ${
        plan.popular
          ? "bg-[#4f6ef7] text-white shadow-xl shadow-blue-200 scale-105"
          : "bg-white border border-gray-200"
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
          Most popular
        </div>
      )}

      <div className="mb-6">
        <p className={`text-sm font-semibold mb-1 ${plan.popular ? "text-blue-200" : "text-gray-500"}`}>
          {plan.name}
        </p>
        <div className="flex items-baseline gap-0.5">
          <span className="text-4xl font-bold">{plan.price}</span>
          {plan.period && (
            <span className={`text-sm ${plan.popular ? "text-blue-200" : "text-gray-400"}`}>
              {plan.period}
            </span>
          )}
        </div>
      </div>

      <ul className="space-y-2.5 flex-1 mb-8">
        {[plan.mau, plan.flows, plan.analytics, plan.support].map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm">
            <span className={plan.popular ? "text-blue-200" : "text-[#4f6ef7]"}>✓</span>
            <span className={plan.popular ? "text-blue-50" : "text-gray-600"}>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/signup"
        className={`block text-center py-2.5 rounded-xl text-sm font-semibold transition-colors ${
          plan.popular
            ? "bg-white text-[#4f6ef7] hover:bg-blue-50"
            : "border border-[#4f6ef7] text-[#4f6ef7] hover:bg-blue-50"
        }`}
      >
        Get started
      </Link>
    </div>
  );
}

/* ── Footer ──────────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          <span className="font-bold text-[#4f6ef7]">FlowLift</span>
          {" — Onboarding that converts"}
        </p>
        <nav className="flex items-center gap-6">
          <a href="#pricing" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            Pricing
          </a>
          <Link href="/login" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            Sign in
          </Link>
        </nav>
      </div>
    </footer>
  );
}
