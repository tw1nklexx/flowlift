import SharedPublicLayout from "@/components/SharedPublicLayout";

export const metadata = {
  title: "Changelog — Nudgify",
  description: "What's new in Nudgify.",
};

const ENTRIES = [
  {
    date: "April 2026",
    label: "Initial launch",
    labelColor: "bg-emerald-100 text-emerald-700",
    items: [
      "Visual flow builder with modal, tooltip, and banner support",
      "AI flow generator — describe a flow in plain English, AI builds it",
      "Smart targeting: URL match, user plan, session count, idle time",
      "Per-condition AND/OR logic in targeting rules",
      "Real-time analytics: impressions, completions, drop-off per step",
      "Stripe billing integration — Free, Starter ($29/mo), Pro ($79/mo)",
      "Free plan: 500 MAU, 1 active flow, forever free",
      "Interactive onboarding tour for new users",
      "Guided tour on the Flows page",
    ],
  },
  {
    date: "March 2026",
    label: "Beta",
    labelColor: "bg-blue-100 text-blue-700",
    items: [
      "Private beta with first users",
      "Core snippet architecture — vanilla TypeScript, under 10KB gzipped",
      "Supabase backend with Row-Level Security",
      "Flow builder UI (3 element types: modal, tooltip, banner)",
      "Basic analytics tracking",
    ],
  },
];

const COMING_SOON = [
  "A/B testing — run two versions of a flow and measure which converts better",
  "Event-based triggers — show flows when users perform specific actions",
  "Team collaboration — invite teammates to manage flows",
  "Chrome extension — build and preview flows without touching code",
  "Webhooks — receive events when users complete or dismiss flows",
];

export default function ChangelogPage() {
  return (
    <SharedPublicLayout>
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-24">
        {/* Header */}
        <div className="mb-14">
          <span className="block text-xs font-bold uppercase tracking-widest text-[#4f6ef7] mb-3">
            What&apos;s new
          </span>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-3">Changelog</h1>
          <p className="text-lg text-gray-500">
            A record of everything we&apos;ve shipped.
          </p>
        </div>

        {/* Entries */}
        <div className="space-y-14 mb-14">
          {ENTRIES.map((entry) => (
            <div key={entry.date} className="relative pl-8">
              {/* Timeline dot */}
              <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-[#4f6ef7] ring-4 ring-brand-50" />
              {/* Vertical line */}
              <div className="absolute left-[5px] top-6 bottom-[-3.5rem] w-px bg-gray-100 last:hidden" />

              <div className="flex items-center gap-3 mb-4">
                <p className="text-sm font-bold text-gray-900">{entry.date}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${entry.labelColor}`}>
                  {entry.label}
                </span>
              </div>
              <ul className="space-y-2.5">
                {entry.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="shrink-0 w-4 h-4 rounded-full bg-brand-50 flex items-center justify-center mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4f6ef7]" />
                    </span>
                    <span className="text-sm text-gray-600 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="border-gray-100 mb-14" />

        {/* Coming soon */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Coming soon</h2>
          <p className="text-sm text-gray-500 mb-6">
            These features are on our roadmap. Priority is driven by customer feedback.{" "}
            <a href="mailto:hello@nudgify.app" className="text-[#4f6ef7] hover:underline">
              Tell us what you need →
            </a>
          </p>
          <ul className="space-y-3">
            {COMING_SOON.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="shrink-0 w-5 h-5 rounded-lg bg-gray-100 flex items-center justify-center mt-0.5 text-gray-400 text-xs font-bold">
                  ·
                </span>
                <span className="text-sm text-gray-500 leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SharedPublicLayout>
  );
}
