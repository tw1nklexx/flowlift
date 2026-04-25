import Link from "next/link";
import CopyButton from "./CopyButton";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://nudgify.app";

const INSTALL_CODE =
  `<!-- Add before closing </body> tag in your HTML -->\n` +
  `<script src="${APP_URL}/snippet" async></script>\n` +
  `<script>\n` +
  `  Nudgify.init("proj_xxxxxxxxxxxx"); // ← copied from your Settings page\n` +
  `</script>`;

const IDENTIFY_CODE =
  `Nudgify.identify({\n` +
  `  id: "user_123",        // your user's unique ID\n` +
  `  plan: "free",          // "free" | "pro"\n` +
  `  session_count: 3,      // how many times they've logged in\n` +
  `  role: "admin",         // optional: "admin" | "viewer"\n` +
  `});`;

const SELECTOR_CODE =
  `#upgrade-btn          // by element ID\n` +
  `.nav-menu             // by CSS class\n` +
  `[data-id="feature"]   // by data attribute`;

const RESET_CODE = `Nudgify.reset();`;

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Nav />

      <div className="max-w-5xl mx-auto px-8 pt-14">
        <div className="flex gap-12">

          {/* ── Sidebar ── */}
          <aside className="hidden lg:block w-48 shrink-0">
            <nav className="sticky top-24 pt-10 pb-4">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                On this page
              </p>
              <ul className="space-y-0.5">
                {[
                  { href: "#quickstart", label: "Quick start" },
                  { href: "#targeting",  label: "Targeting rules" },
                  { href: "#steps",      label: "Step types" },
                  { href: "#analytics",  label: "Analytics" },
                  { href: "#faq",        label: "FAQ" },
                ].map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="block px-2 py-1.5 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* ── Main ── */}
          <main className="flex-1 min-w-0 py-10 pb-24">

            {/* Page hero */}
            <div className="mb-12">
              <span className="inline-flex items-center gap-2 bg-blue-50 text-[#4f6ef7] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                Documentation
              </span>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-3">
                Nudgify Docs
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed">
                Install, configure, and understand your onboarding flows.
              </p>
            </div>

            <Divider />

            {/* ── Quick Start ── */}
            <section className="mb-16">
              <SectionHeader
                id="quickstart"
                title="Get started in 10 minutes"
                subtitle="One line of code. Your developer does it once — after that, you manage everything from the dashboard."
              />

              <h3 className="text-sm font-semibold text-gray-800 mb-3">1. Install the snippet</h3>
              <CodeBlock filename="index.html" code={INSTALL_CODE} />
              <p className="text-sm text-gray-500 mt-3 mb-2">
                Replace{" "}
                <Mono>proj_xxxxxxxxxxxx</Mono>{" "}
                with your project key from the{" "}
                <Link href="/settings" className="text-[#4f6ef7] hover:underline">Settings page</Link>.
                It&apos;s pre-filled there — just copy and paste.
              </p>
              <p className="text-sm text-gray-500 mb-4">
                The snippet URL is automatically set to your Nudgify deployment. Copy the
                pre-filled snippet from your{" "}
                <Link href="/settings" className="text-[#4f6ef7] hover:underline">Settings page</Link>{" "}
                to get your exact URL.
              </p>
              <Tip className="mb-8">
                Works immediately, no configuration needed. Nudgify will show a demo flow
                so you can confirm it&apos;s installed correctly.
              </Tip>

              {/* Optional: identify */}
              <div className="border border-gray-100 rounded-xl p-6 mb-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-gray-800">Optional: identify your users for smarter targeting</h3>
                  <span className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase tracking-wide">
                    optional
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                  Call <Mono>Nudgify.identify()</Mono> after your user logs in to unlock
                  plan-based and session-based targeting rules.
                </p>
                <CodeBlock code={IDENTIFY_CODE} />

                <div className="mt-4 border border-gray-100 rounded-xl overflow-hidden">
                  {[
                    {
                      name: "id",
                      type: "string",
                      desc: "Your user's unique ID from your database.",
                    },
                    {
                      name: "plan",
                      type: '"free" | "pro"',
                      desc: "Their current subscription tier. Used in upgrade-prompt targeting.",
                    },
                    {
                      name: "session_count",
                      type: "number",
                      desc: "Number of sessions this user has had. Target first-timers or power users.",
                    },
                    {
                      name: "role",
                      type: "string (optional)",
                      desc: 'Any role string — e.g. "admin" or "viewer". Available for future targeting rules.',
                    },
                  ].map((p, i, arr) => (
                    <div
                      key={p.name}
                      className={`flex items-start gap-4 px-5 py-3.5 ${i < arr.length - 1 ? "border-b border-gray-50" : ""}`}
                    >
                      <div className="shrink-0 w-44">
                        <code className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-mono font-semibold">
                          {p.name}
                        </code>
                        <span className="block text-[11px] text-gray-400 font-mono mt-0.5 ml-0.5">
                          {p.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{p.desc}</p>
                    </div>
                  ))}
                </div>

                <Tip className="mt-5">
                  <strong>Tip:</strong> Call <Mono blue>identify()</Mono> every session — Nudgify
                  always uses the latest values for targeting. It&apos;s fine to call{" "}
                  <Mono blue>init()</Mono> before the user is known; just follow it with{" "}
                  <Mono blue>identify()</Mono> as soon as you have their data.
                </Tip>
              </div>
            </section>

            <Divider />

            {/* ── Targeting Rules ── */}
            <section className="mb-16">
              <SectionHeader
                id="targeting"
                title="Show flows to the right users"
                subtitle="Each flow has targeting rules that control who sees it. Rules are evaluated in the browser — no server round trip."
              />

              <div className="space-y-4 mb-8">
                <RuleCard
                  icon="🔗"
                  title="URL contains"
                  desc="Shows the flow only on pages whose URL matches the given string."
                  examples={[
                    { value: "/dashboard", note: "only shows on the dashboard" },
                    { value: "/settings",  note: "only shows on settings" },
                    { value: "app.",       note: "only shows on your app subdomain" },
                  ]}
                />
                <RuleCard
                  icon="💳"
                  title="User plan"
                  desc="Matches users on a specific subscription tier. Perfect for upgrade prompts."
                  examples={[
                    { value: "free", note: "shows only to free-plan users" },
                    { value: "pro",  note: "shows only to paying users" },
                  ]}
                />
                <RuleCard
                  icon="🔄"
                  title="Session count"
                  desc="Matches based on how many sessions a user has had. Three comparison operators."
                  examples={[
                    { value: "≤ 1",  note: "first-time visitors only (lte 1)" },
                    { value: "≥ 5",  note: "power users only (gte 5)" },
                    { value: "= 10", note: "exactly their 10th session (eq 10)" },
                  ]}
                />
              </div>

              <h3 className="text-sm font-semibold text-gray-800 mb-3">AND vs OR logic</h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                When you add multiple conditions, choose how they combine in the Targeting tab.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-1">AND</p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    All conditions must match. Example: free plan{" "}
                    <span className="font-semibold text-gray-700">AND</span>{" "}
                    URL contains /dashboard.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-1">OR</p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Any condition can match. Example: free plan{" "}
                    <span className="font-semibold text-gray-700">OR</span>{" "}
                    session count ≤ 1.
                  </p>
                </div>
              </div>
            </section>

            <Divider />

            {/* ── Step Types ── */}
            <section className="mb-16">
              <SectionHeader
                id="steps"
                title="Three ways to reach your users"
                subtitle="Each step in a flow is one of three types. Mix and match them to create a guided experience."
              />

              <div className="space-y-4">
                <StepTypeCard
                  icon="🪟"
                  name="Modal"
                  badge="Highest visibility"
                  badgeColor="bg-purple-50 text-purple-600"
                  desc="A centered overlay with a dimmed background. Grabs full attention — ideal for first-time welcomes, important announcements, and upgrade prompts."
                  tips={[
                    "Supports an optional title + body text",
                    "Closes when user clicks outside or hits ✕",
                    "Multi-step flows show a step counter (e.g. 1 of 3)",
                  ]}
                />
                <StepTypeCard
                  icon="💬"
                  name="Tooltip"
                  badge="Contextual"
                  badgeColor="bg-blue-50 text-blue-600"
                  desc="Anchored to a specific element on the page via a CSS selector. Points users to exactly what you're describing."
                  tips={[
                    "Falls back to bottom-right corner if the selector isn't found",
                    "Selector is set in the Content tab of the flow builder",
                  ]}
                >
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                      Target selector examples
                    </p>
                    <CodeBlock code={SELECTOR_CODE} />
                  </div>
                </StepTypeCard>
                <StepTypeCard
                  icon="📢"
                  name="Banner"
                  badge="Non-intrusive"
                  badgeColor="bg-green-50 text-green-700"
                  desc="A full-width strip pinned to the top or bottom of the page. Low friction — best for feature announcements and soft nudges."
                  tips={[
                    "Supports top or bottom position",
                    "Background color and padding are customizable in the Design tab",
                  ]}
                />
              </div>
            </section>

            <Divider />

            {/* ── Analytics ── */}
            <section className="mb-16">
              <SectionHeader
                id="analytics"
                title="Understanding your data"
                subtitle="Nudgify tracks user interactions automatically. No extra code needed beyond the initial install."
              />

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {[
                  {
                    metric: "Impressions",
                    def: "How many times a flow was shown to a user.",
                    color: "bg-blue-50 text-blue-700",
                  },
                  {
                    metric: "Completions",
                    def: "User clicked through all steps and hit a Complete action.",
                    color: "bg-green-50 text-green-700",
                  },
                  {
                    metric: "Completion rate",
                    def: "Completions ÷ impressions × 100. The primary health metric.",
                    color: "bg-purple-50 text-purple-700",
                  },
                ].map((m) => (
                  <div key={m.metric} className="bg-gray-50 rounded-xl p-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md inline-block mb-2 ${m.color}`}>
                      {m.metric}
                    </span>
                    <p className="text-sm text-gray-600 leading-relaxed">{m.def}</p>
                  </div>
                ))}
              </div>

              <h3 className="text-sm font-semibold text-gray-800 mb-3">Events tracked automatically</h3>
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                {[
                  { event: "flow_shown",      desc: "The flow was displayed to the user." },
                  { event: "step_advanced",   desc: "User clicked the CTA button on a step." },
                  { event: "flow_completed",  desc: "User finished the last step (or clicked a Complete action)." },
                  { event: "flow_dismissed",  desc: "User closed the flow early via the ✕ button." },
                ].map((e, i, arr) => (
                  <div
                    key={e.event}
                    className={`flex items-start gap-4 px-5 py-4 ${i < arr.length - 1 ? "border-b border-gray-100" : ""}`}
                  >
                    <code className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-mono shrink-0 mt-0.5">
                      {e.event}
                    </code>
                    <p className="text-sm text-gray-600">{e.desc}</p>
                  </div>
                ))}
              </div>

              <Tip className="mt-5">
                Events are <strong>batched</strong> and sent every 5 seconds, or immediately
                on page unload. This keeps network requests minimal without losing data.
              </Tip>
            </section>

            <Divider />

            {/* ── FAQ ── */}
            <section className="mb-14">
              <SectionHeader
                id="faq"
                title="FAQ"
                subtitle="Common questions about Nudgify."
              />

              <div className="space-y-7">
                <FaqItem
                  q="Will it slow down my app?"
                  a="No. The snippet loads asynchronously (async attribute) and is under 10 KB gzipped. It has zero dependencies and is designed to never block your app's rendering."
                />
                <FaqItem
                  q="Does it work with React / Vue / Angular?"
                  a="Yes — Nudgify is plain JavaScript with no framework dependencies. It injects lightweight DOM elements directly, so it works inside any framework or plain HTML app."
                />
                <FaqItem
                  q="What happens if a user has an ad blocker?"
                  a="Unlike tools that load from a third-party CDN, Nudgify's snippet is served from your own domain. Ad blockers target known third-party domains, so your flows are unaffected."
                />
                <FaqItem
                  q="Can I show a flow multiple times?"
                  a={
                    <>
                      By default each flow shows once per user (tracked in{" "}
                      <Mono>localStorage</Mono>). To show it again — useful for testing
                      — call:
                      <div className="mt-3">
                        <CodeBlock code={RESET_CODE} />
                      </div>
                      This clears all shown-flow state for the current browser.
                    </>
                  }
                />
              </div>
            </section>

            {/* CTA */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100 rounded-2xl p-8 text-center">
              <p className="text-lg font-bold text-gray-900 mb-2">Ready to get started?</p>
              <p className="text-sm text-gray-500 mb-5">
                Create your account and ship your first flow today.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center px-5 py-2.5 bg-[#4f6ef7] text-white text-sm font-semibold rounded-lg hover:bg-[#3b5af5] transition-colors shadow-sm"
              >
                Start for free →
              </Link>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}

/* ── Shared nav ──────────────────────────────────────────────────────────── */

function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[#4f6ef7]">
          Nudgify
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/docs"
            className="text-sm font-medium text-[#4f6ef7]"
          >
            Docs
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}

/* ── Layout helpers ──────────────────────────────────────────────────────── */

function Divider() {
  return <hr className="border-gray-100 mb-14" />;
}

function SectionHeader({
  id,
  title,
  subtitle,
}: {
  id: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-7">
      <h2
        id={id}
        className="text-2xl font-bold text-gray-900 mb-2 scroll-mt-24"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-500 leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}

function Tip({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-blue-50 border-l-4 border-[#4f6ef7] rounded-r-xl px-5 py-4 text-sm text-blue-900 leading-relaxed ${className}`}
    >
      {children}
    </div>
  );
}

function Mono({
  children,
  blue,
}: {
  children: React.ReactNode;
  blue?: boolean;
}) {
  return (
    <code
      className={`px-1.5 py-0.5 rounded text-xs font-mono font-semibold ${
        blue ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
      }`}
    >
      {children}
    </code>
  );
}

function CodeBlock({
  code,
  filename,
}: {
  code: string;
  filename?: string;
}) {
  return (
    <div className="relative">
      <div className="bg-[#0d1117] rounded-xl overflow-hidden">
        {filename && (
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            <span className="ml-1 text-xs text-gray-500 font-mono">{filename}</span>
          </div>
        )}
        <pre className="px-5 py-4 text-[13px] font-mono text-gray-300 overflow-x-auto leading-relaxed">
          {code}
        </pre>
      </div>
      <div className="absolute top-2 right-2">
        <CopyButton text={code} />
      </div>
    </div>
  );
}

/* ── Content components ──────────────────────────────────────────────────── */

function RuleCard({
  icon,
  title,
  desc,
  examples,
}: {
  icon: string;
  title: string;
  desc: string;
  examples: { value: string; note: string }[];
}) {
  return (
    <div className="border border-gray-100 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">{icon}</span>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-sm text-gray-500 mb-4 leading-relaxed">{desc}</p>
      <div className="space-y-2">
        {examples.map((ex) => (
          <div key={ex.value} className="flex items-center gap-3">
            <code className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-mono font-semibold shrink-0 min-w-[64px] text-center">
              {ex.value}
            </code>
            <span className="text-xs text-gray-400">→ {ex.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepTypeCard({
  icon,
  name,
  badge,
  badgeColor,
  desc,
  tips,
  children,
}: {
  icon: string;
  name: string;
  badge: string;
  badgeColor: string;
  desc: string;
  tips: string[];
  children?: React.ReactNode;
}) {
  return (
    <div className="border border-gray-100 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xl">{icon}</span>
        <h3 className="font-semibold text-gray-900">{name}</h3>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>
          {badge}
        </span>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed mb-3">{desc}</p>
      <ul className="space-y-1">
        {tips.map((tip) => (
          <li key={tip} className="text-xs text-gray-400 flex items-start gap-2">
            <span className="text-gray-300 shrink-0 mt-0.5">—</span>
            {tip}
          </li>
        ))}
      </ul>
      {children}
    </div>
  );
}

function FaqItem({
  q,
  a,
}: {
  q: string;
  a: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-100 pb-7">
      <p className="font-semibold text-gray-900 mb-2">{q}</p>
      <div className="text-sm text-gray-600 leading-relaxed">{a}</div>
    </div>
  );
}
