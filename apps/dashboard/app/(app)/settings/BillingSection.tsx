"use client";

import { UpgradeButton } from "./UpgradeButton";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "$29/mo",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER ?? "",
    features: ["Unlimited flows", "10K MAU", "Analytics"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$79/mo",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO ?? "",
    features: ["Everything in Starter", "50K MAU", "Priority support"],
  },
];

export default function BillingSection({ plan }: { plan: string }) {
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
            {plan === p.id ? (
              <div className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-500 text-sm text-center">
                Current plan
              </div>
            ) : (
              <UpgradeButton priceId={p.priceId} label={`Upgrade to ${p.name}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
