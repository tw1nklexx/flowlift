import Link from "next/link";
import SharedPublicLayout from "@/components/SharedPublicLayout";

export const metadata = {
  title: "API Reference — Nudgify",
  description: "Nudgify API reference. Client-side snippet API and upcoming server API.",
};

export default function ApiReferencePage() {
  return (
    <SharedPublicLayout>
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-24">
        {/* Header */}
        <div className="mb-12">
          <Link href="/docs" className="text-sm text-[#4f6ef7] hover:underline mb-4 inline-block">
            ← Back to docs
          </Link>
          <span className="block text-xs font-bold uppercase tracking-widest text-[#4f6ef7] mb-3">
            Reference
          </span>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-3">API Reference</h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Nudgify is currently a client-side product. There is no server API — all logic runs in the browser snippet.
          </p>
        </div>

        <hr className="border-gray-100 mb-10" />

        {/* Current API */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Client-side snippet API</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            The Nudgify snippet exposes a small JavaScript API via the global <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">Nudgify</code> object.
            This is everything you need to integrate Nudgify into your app.
          </p>

          <div className="grid gap-4">
            {[
              {
                method: "Nudgify.init(projectKey, options?)",
                summary: "Initializes the snippet and triggers flow evaluation.",
                href: "/docs/snippet#methods",
              },
              {
                method: "Nudgify.identify(user)",
                summary: "Pass user properties for plan/session-based targeting.",
                href: "/docs/snippet#methods",
              },
              {
                method: "Nudgify.reset()",
                summary: "Clears shown-flow localStorage state. Useful for testing.",
                href: "/docs/snippet#methods",
              },
            ].map((m) => (
              <Link
                key={m.method}
                href={m.href}
                className="flex items-start gap-4 border border-gray-100 rounded-xl p-5 hover:border-brand-200 hover:bg-brand-50/30 transition-colors group"
              >
                <div className="flex-1">
                  <code className="text-sm font-mono font-bold text-[#4f6ef7]">{m.method}</code>
                  <p className="text-sm text-gray-500 mt-1">{m.summary}</p>
                </div>
                <span className="text-[#4f6ef7] text-sm shrink-0 group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            ))}
          </div>

          <p className="text-sm text-gray-500 mt-5">
            See the full{" "}
            <Link href="/docs/snippet" className="text-[#4f6ef7] hover:underline">
              Snippet Reference
            </Link>{" "}
            for parameters, return values, and usage examples.
          </p>
        </section>

        <hr className="border-gray-100 mb-10" />

        {/* Server API coming soon */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Server API</h2>
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0">🚧</span>
              <div>
                <p className="text-sm font-semibold text-amber-900 mb-1">Coming soon</p>
                <p className="text-sm text-amber-800 leading-relaxed mb-3">
                  A server-side REST API is on our roadmap. It will let you manage flows, pull analytics,
                  and identify users server-side — useful for server-rendered apps and backend integrations.
                </p>
                <p className="text-sm text-amber-700">
                  For early access, contact{" "}
                  <a href="mailto:hello@nudgify.app" className="font-semibold underline hover:text-amber-900">
                    hello@nudgify.app
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100 rounded-2xl p-8 text-center">
          <p className="text-base font-bold text-gray-900 mb-2">Need something specific?</p>
          <p className="text-sm text-gray-500 mb-5">
            We&apos;re a small team and we ship fast. Tell us what you need.
          </p>
          <a
            href="mailto:hello@nudgify.app"
            className="inline-flex items-center px-5 py-2.5 bg-[#4f6ef7] text-white text-sm font-semibold rounded-lg hover:bg-[#3b5af5] transition-colors"
          >
            Email hello@nudgify.app
          </a>
        </div>
      </div>
    </SharedPublicLayout>
  );
}
