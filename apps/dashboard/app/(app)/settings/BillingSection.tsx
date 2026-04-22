"use client";

import { useState } from "react";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "$29/mo",
    features: ["Unlimited flows", "10K MAU", "Analytics"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$79/mo",
    features: ["Everything in Starter", "50K MAU", "Priority support"],
  },
];

export default function BillingSection({ plan }: { plan: string }) {
  const [loading, setLoading] = useState<string | null>(null);

  async function checkout(planId: string) {
    setLoading(planId);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId }),
    });
    const { url, error } = await res.json();
    if (error) {
      alert(error);
      setLoading(null);
      return;
    }
    window.location.href = url;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-600">Current plan:</span>
        <span className="text-sm font-medium bg-gray-100 px-2 py-0.5 rounded-full capitalize">
          {plan}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {PLANS.map((p) => (
          <div key={p.id} className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-baseline justify-between mb-3">
              <span className="font-semibold text-gray-900">{p.name}</span>
              <span className="text-sm font-bold text-gray-900">{p.price}</span>
            </div>
            <ul className="space-y-1 mb-4">
              {p.features.map((f) => (
                <li key={f} className="text-xs text-gray-500 flex items-center gap-1">
                  <span className="text-green-500">✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => checkout(p.id)}
              disabled={!!loading || plan === p.id}
              className="w-full py-2 text-xs font-medium rounded-lg border border-brand-400 text-brand-600 hover:bg-brand-50 disabled:opacity-50 transition-colors"
            >
              {plan === p.id ? "Current plan" : loading === p.id ? "Redirecting…" : `Upgrade to ${p.name}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
