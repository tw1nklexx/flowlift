"use client";

import { UpgradeButton } from "./UpgradeButton";

const PLAN_META = [
  {
    id: "starter",
    name: "Starter",
    price: "$29/mo",
    features: ["Unlimited flows", "10K MAU", "Analytics"],
    benefits: [
      "Remove watermark from your flows",
      "Unlock advanced targeting (plan, role, idle time)",
      "Priority email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$79/mo",
    features: ["Everything in Starter", "50K MAU", "Priority support"],
    benefits: [
      "Everything in Starter",
      "50,000 MAU — scale without limits",
      "Dedicated onboarding support",
    ],
  },
];

export default function BillingSection({
  plan,
  starterPriceId,
  proPriceId,
}: {
  plan: string;
  starterPriceId: string;
  proPriceId: string;
}) {
  const priceIds: Record<string, string> = { starter: starterPriceId, pro: proPriceId };
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-600">Current plan:</span>
        <span className="text-sm font-medium bg-gray-100 px-2 py-0.5 rounded-full capitalize">
          {plan}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {PLAN_META.map((p) => (
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
            {plan !== p.id && (
              <div className="bg-green-50 border border-green-100 rounded-lg px-3 py-2.5 mb-3">
                {p.benefits.map((b) => (
                  <p key={b} className="text-xs text-green-700 leading-relaxed">✓ {b}</p>
                ))}
              </div>
            )}
            {plan === p.id ? (
              <div className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-500 text-sm text-center">
                Current plan
              </div>
            ) : (
              <UpgradeButton priceId={priceIds[p.id]} label={`Upgrade to ${p.name}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
