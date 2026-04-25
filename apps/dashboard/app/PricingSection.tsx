"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

/* ─── Data ──────────────────────────────────────────────────────────────── */

const PLANS = [
  {
    name: "Free",
    monthly: 0,
    annual: 0,
    annualTotal: null,
    mau: "500 MAU",
    flows: "1 active flow",
    analytics: "Basic analytics",
    support: "Community support",
    watermark: true,
    popular: false,
  },
  {
    name: "Starter",
    monthly: 29,
    annual: 24,
    annualTotal: 290,
    mau: "10,000 MAU",
    flows: "Unlimited flows",
    analytics: "Full analytics + export",
    support: "Email support",
    watermark: false,
    popular: true,
  },
  {
    name: "Pro",
    monthly: 79,
    annual: 65,
    annualTotal: 790,
    mau: "50,000 MAU",
    flows: "Unlimited flows",
    analytics: "Full analytics + export",
    support: "Priority support",
    watermark: false,
    popular: false,
  },
];

const FAQS = [
  {
    q: "Do I need a developer?",
    a: "Only once — to add the script tag. After that, you manage everything yourself from the dashboard. No code changes needed for new flows.",
  },
  {
    q: "Will it slow down my app?",
    a: "No. The snippet is under 10KB and loads asynchronously. It will never block your app from rendering.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no questions asked. Cancel from the dashboard in one click and you won't be charged again.",
  },
];

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function PricingSection() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="pricing" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Simple, honest pricing
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
            Start free. Upgrade when you grow.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-gray-100 p-1 rounded-full">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                !annual ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                annual ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
              }`}
            >
              Annual
              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full transition-colors ${
                annual ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-400"
              }`}>
                −17%
              </span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-6">
          {PLANS.map((plan) => {
            const price = annual ? plan.annual : plan.monthly;
            const isPopular = plan.popular;
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-7 flex flex-col transition-transform duration-200 ${
                  isPopular
                    ? "bg-[#4f6ef7] text-white shadow-xl shadow-blue-200 md:scale-105"
                    : "bg-white border border-gray-200 hover:border-gray-300"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    Most popular
                  </div>
                )}

                <div className="mb-6">
                  <p className={`text-sm font-semibold mb-2 ${isPopular ? "text-blue-200" : "text-gray-500"}`}>
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">
                      {price === 0 ? "$0" : `$${price}`}
                    </span>
                    {price > 0 && (
                      <span className={`text-sm ${isPopular ? "text-blue-200" : "text-gray-400"}`}>
                        /mo
                      </span>
                    )}
                  </div>
                  {annual && plan.annualTotal && (
                    <p className={`text-xs mt-1 ${isPopular ? "text-blue-200" : "text-gray-400"}`}>
                      ${plan.annualTotal}/yr · 2 months free
                    </p>
                  )}
                </div>

                <ul className="space-y-2.5 flex-1 mb-8">
                  {[plan.mau, plan.flows, plan.analytics, plan.support].map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check
                        size={15}
                        className={`shrink-0 mt-0.5 ${isPopular ? "text-blue-200" : "text-[#4f6ef7]"}`}
                        strokeWidth={2.5}
                      />
                      <span className={isPopular ? "text-blue-50" : "text-gray-600"}>{feature}</span>
                    </li>
                  ))}
                  {plan.watermark && (
                    <li className={`flex items-start gap-2 text-sm ${isPopular ? "text-blue-200" : "text-gray-400"}`}>
                      <span className="mt-0.5 w-[15px] shrink-0 text-center text-xs">–</span>
                      <span>FlowLift watermark</span>
                    </li>
                  )}
                </ul>

                <Link
                  href="/signup"
                  className={`block text-center py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    isPopular
                      ? "bg-white text-[#4f6ef7] hover:bg-blue-50"
                      : "border border-[#4f6ef7] text-[#4f6ef7] hover:bg-blue-50"
                  }`}
                >
                  {price === 0 ? "Start for free" : "Get started"}
                </Link>
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-gray-400 mb-16">
          All plans include the embeddable snippet, flow builder, and analytics.
        </p>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-6">
            Common questions
          </h3>
          <div className="space-y-2">
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500"
                  >
                    <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
                    {isOpen
                      ? <ChevronUp size={16} className="text-gray-400 shrink-0" />
                      : <ChevronDown size={16} className="text-gray-400 shrink-0" />
                    }
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ maxHeight: isOpen ? "200px" : "0px" }}
                  >
                    <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
