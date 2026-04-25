import Link from "next/link";
import SharedPublicLayout from "@/components/SharedPublicLayout";

export const metadata = {
  title: "Snippet Reference — Nudgify",
  description: "Full API reference for the Nudgify JavaScript snippet.",
};

const INSTALL_CODE =
  `<!-- Add before closing </body> tag -->\n` +
  `<script src="https://nudgify.app/snippet" async></script>\n` +
  `<script>\n` +
  `  Nudgify.init("proj_xxxxxxxxxxxx");\n` +
  `</script>`;

const IDENTIFY_CODE =
  `Nudgify.identify({\n` +
  `  id: "user_123",        // your user's unique ID\n` +
  `  plan: "free",          // "free" | "pro"\n` +
  `  session_count: 3,      // how many times they've logged in\n` +
  `  role: "admin",         // optional\n` +
  `});`;

const RESET_CODE = `Nudgify.reset();`;

export default function SnippetReferencePage() {
  return (
    <SharedPublicLayout>
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-24">
        {/* Page header */}
        <div className="mb-12">
          <Link href="/docs" className="text-sm text-[#4f6ef7] hover:underline mb-4 inline-block">
            ← Back to docs
          </Link>
          <span className="block text-xs font-bold uppercase tracking-widest text-[#4f6ef7] mb-3">
            Reference
          </span>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-3">Snippet Reference</h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Full API documentation for the Nudgify JavaScript snippet.
          </p>
        </div>

        <hr className="border-gray-100 mb-10" />

        {/* Installation */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-2 scroll-mt-24" id="installation">
            Installation
          </h2>
          <p className="text-sm text-gray-500 mb-5 leading-relaxed">
            Paste the snippet before the closing <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">&lt;/body&gt;</code> tag
            in your app&apos;s HTML. Your developer does this once — after that, you manage everything from the dashboard.
          </p>
          <CodeBlock filename="index.html" code={INSTALL_CODE} />
          <p className="text-sm text-gray-500 mt-4">
            Replace <Mono>proj_xxxxxxxxxxxx</Mono> with your project key from the{" "}
            <Link href="/settings" className="text-[#4f6ef7] hover:underline">Settings page</Link>.
          </p>
        </section>

        <hr className="border-gray-100 mb-10" />

        {/* Methods */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 scroll-mt-24" id="methods">Methods</h2>

          {/* init */}
          <MethodCard
            name="Nudgify.init(projectKey, options?)"
            description="Initializes the snippet. Call once on page load, before identify(). After this, Nudgify evaluates targeting rules and shows matching flows."
            params={[
              { name: "projectKey", type: "string", required: true, desc: "Your project API key from the Settings page." },
              { name: "options.hideWatermark", type: "boolean", required: false, desc: "Hides the 'Powered by Nudgify' badge. Available on paid plans." },
            ]}
          />

          {/* identify */}
          <MethodCard
            name="Nudgify.identify(user)"
            description="Optional. Pass user properties to enable plan-based and session-based targeting. Call after your user logs in. It's safe to call init() before identify() — Nudgify re-evaluates rules when identify() is called."
            example={IDENTIFY_CODE}
            params={[
              { name: "id", type: "string", required: false, desc: "Your user's unique ID from your database." },
              { name: "plan", type: "string", required: false, desc: '"free" | "pro" — used in upgrade-prompt targeting.' },
              { name: "session_count", type: "number", required: false, desc: "How many sessions this user has had. Target first-timers or power users." },
              { name: "role", type: "string", required: false, desc: 'Optional role string — e.g. "admin" | "viewer".' },
            ]}
          />

          {/* reset */}
          <MethodCard
            name="Nudgify.reset()"
            description="Clears all shown-flow state in localStorage. Useful for testing — lets you see flows again without creating a new user."
            example={RESET_CODE}
            params={[]}
          />
        </section>

        <hr className="border-gray-100 mb-10" />

        {/* Events */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-3 scroll-mt-24" id="events">
            Events tracked automatically
          </h2>
          <p className="text-sm text-gray-500 mb-5 leading-relaxed">
            Nudgify tracks these events automatically and sends them to your analytics dashboard.
            Events are batched and sent every 5 seconds, or immediately on page unload.
          </p>
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            {[
              { event: "flow_shown",      desc: "The flow was displayed to the user." },
              { event: "step_advanced",   desc: "User clicked the CTA button to advance to the next step." },
              { event: "flow_completed",  desc: "User finished the last step (or clicked a Complete action)." },
              { event: "flow_dismissed",  desc: "User closed the flow early via the ✕ button." },
            ].map((e, i, arr) => (
              <div
                key={e.event}
                className={`flex items-start gap-4 px-5 py-4 ${i < arr.length - 1 ? "border-b border-gray-100" : ""}`}
              >
                <code className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-mono shrink-0 mt-0.5 whitespace-nowrap">
                  {e.event}
                </code>
                <p className="text-sm text-gray-600">{e.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100 rounded-2xl p-8 text-center">
          <p className="text-base font-bold text-gray-900 mb-2">Ready to install?</p>
          <p className="text-sm text-gray-500 mb-5">
            Copy your snippet from Settings and paste it into your app.
          </p>
          <Link
            href="/settings"
            className="inline-flex items-center px-5 py-2.5 bg-[#4f6ef7] text-white text-sm font-semibold rounded-lg hover:bg-[#3b5af5] transition-colors"
          >
            Go to Settings →
          </Link>
        </div>
      </div>
    </SharedPublicLayout>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-xs font-mono font-semibold">
      {children}
    </code>
  );
}

function CodeBlock({ code, filename }: { code: string; filename?: string }) {
  return (
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
  );
}

function MethodCard({
  name,
  description,
  params,
  example,
}: {
  name: string;
  description: string;
  params: { name: string; type: string; required: boolean; desc: string }[];
  example?: string;
}) {
  return (
    <div className="border border-gray-100 rounded-xl p-6 mb-5">
      <code className="text-sm font-mono font-bold text-[#4f6ef7] block mb-3">{name}</code>
      <p className="text-sm text-gray-600 leading-relaxed mb-4">{description}</p>
      {example && (
        <div className="mb-4">
          <CodeBlock code={example} />
        </div>
      )}
      {params.length > 0 && (
        <div className="border border-gray-100 rounded-lg overflow-hidden">
          {params.map((p, i) => (
            <div
              key={p.name}
              className={`flex items-start gap-4 px-4 py-3 ${i < params.length - 1 ? "border-b border-gray-50" : ""} bg-gray-50/40`}
            >
              <div className="shrink-0 w-40">
                <code className="bg-white border border-gray-200 text-gray-800 px-2 py-0.5 rounded text-xs font-mono font-semibold">
                  {p.name}
                </code>
                <span className="block text-[11px] text-gray-400 font-mono mt-0.5 ml-0.5">{p.type}</span>
                {p.required && (
                  <span className="text-[10px] text-red-400 font-semibold ml-0.5">required</span>
                )}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
