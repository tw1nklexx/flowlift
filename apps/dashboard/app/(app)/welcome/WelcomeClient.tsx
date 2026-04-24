"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Props {
  apiKey: string;
}

export default function WelcomeClient({ apiKey }: Props) {
  const [step2Done, setStep2Done] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [copied, setCopied] = useState<"key" | "snippet" | null>(null);
  const [installTab, setInstallTab] = useState<"simple" | "advanced">("simple");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("fl_onboarding");
      if (saved) {
        const { step2Done: done } = JSON.parse(saved);
        if (done) setStep2Done(true);
      }
    } catch {}

    const t = setTimeout(() => setBannerVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  function completeStep2() {
    setStep2Done(true);
    try {
      localStorage.setItem("fl_onboarding", JSON.stringify({ step2Done: true }));
    } catch {}
  }

  function copy(text: string, key: "key" | "snippet") {
    navigator.clipboard.writeText(text).catch(() => {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    });
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  const simpleCode =
    `<!-- Add before closing </body> tag in your HTML -->\n` +
    `<script src="https://your-domain.com/snippet" async></script>\n` +
    `<script>\n` +
    `  FlowLift.init("${apiKey}"); // ← copied from your Settings page\n` +
    `</script>`;

  const advancedCode =
    `<!-- Add before closing </body> tag -->\n` +
    `<script src="https://your-domain.com/snippet" async></script>\n` +
    `<script>\n` +
    `  FlowLift.init("${apiKey}");\n` +
    `\n` +
    `  // Call this after your user logs in:\n` +
    `  FlowLift.identify({\n` +
    `    id: user.id,        // required: your user's unique ID\n` +
    `    plan: user.plan,    // "free" | "pro" — for plan-based targeting\n` +
    `  });\n` +
    `</script>`;

  const installCode = installTab === "simple" ? simpleCode : advancedCode;

  return (
    <>
      <style>{`
        @keyframes fl-rise {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Meta-demo banner */}
      <div
        className="fixed top-0 left-0 right-0 z-[9999] bg-[#4f6ef7] shadow-lg flex items-center justify-between px-6 py-3"
        style={{
          transform: bannerVisible && !bannerDismissed ? "translateY(0)" : "translateY(-110%)",
          transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <p className="text-sm text-white">
          👋 By the way — this is exactly what your users will see
        </p>
        <button
          onClick={() => setBannerDismissed(true)}
          className="text-white/60 hover:text-white text-xl ml-6 leading-none transition-colors"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>

      {/* Page */}
      <div className="min-h-full px-6 py-8">
        <div className="max-w-[560px] mx-auto">

          {/* Top nav */}
          <div
            className="flex items-center justify-between mb-10"
            style={{ animation: "fl-rise 350ms ease both" }}
          >
            <span className="text-lg font-bold text-[#4f6ef7]">FlowLift</span>
            <Link href="/flows" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              Skip for now →
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-8" style={{ animation: "fl-rise 350ms ease 60ms both" }}>
            <h1 className="text-[26px] font-bold text-gray-900 tracking-tight mb-1">
              Let&apos;s get you set up
            </h1>
            <p className="text-sm text-gray-500">Three steps and you&apos;re live.</p>
          </div>

          {/* Steps */}
          <div className="space-y-3">

            {/* ── Step 1: always done ── */}
            <StepCard
              done
              active={false}
              delay={120}
              title="Your account is ready ✓"
              body="Here's your unique project key — you'll need this in the next step."
            >
              <div className="mt-4 bg-[#0d1117] rounded-xl px-4 py-3.5 flex items-center justify-between gap-4">
                <code className="text-emerald-400 text-sm font-mono tracking-wide truncate">
                  {apiKey}
                </code>
                <button
                  onClick={() => copy(apiKey, "key")}
                  className="text-xs font-medium text-gray-500 hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
                >
                  {copied === "key" ? "Copied ✓" : "Copy"}
                </button>
              </div>
            </StepCard>

            {/* ── Step 2: install snippet ── */}
            <StepCard
              done={step2Done}
              active={!step2Done}
              delay={220}
              title="Add one line to your app"
              body={`Drop this before the closing </body> tag. Your developer does it once — you own everything after that.`}
            >
              {/* Simple / Advanced tabs */}
              <div className="mt-4 flex gap-0 border border-gray-200 rounded-lg overflow-hidden w-fit">
                {(["simple", "advanced"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => { setInstallTab(tab); setCopied(null); }}
                    className={`px-3 py-1.5 text-xs font-semibold transition-colors capitalize ${
                      installTab === tab
                        ? "bg-[#4f6ef7] text-white"
                        : "bg-white text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="mt-2 bg-[#0d1117] rounded-xl px-4 py-3.5">
                <div className="flex items-start justify-between gap-4">
                  <pre className="text-emerald-400 text-xs font-mono leading-relaxed overflow-x-auto flex-1 whitespace-pre">
                    {installCode}
                  </pre>
                  <button
                    onClick={() => copy(installCode, "snippet")}
                    className="mt-0.5 text-xs font-medium text-gray-500 hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
                  >
                    {copied === "snippet" ? "Copied ✓" : "Copy"}
                  </button>
                </div>
              </div>

              {installTab === "simple" ? (
                <div className="mt-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-3 text-xs text-blue-800 leading-relaxed">
                  📌 <strong>Where to add this:</strong> In your app&apos;s main HTML file (e.g.{" "}
                  <code className="bg-blue-100 px-1 rounded">index.html</code>,{" "}
                  <code className="bg-blue-100 px-1 rounded">_document.tsx</code>), just before
                  the closing <code className="bg-blue-100 px-1 rounded">&lt;/body&gt;</code> tag.
                  Your developer does this once — you manage everything else from the dashboard.
                </div>
              ) : (
                <div className="mt-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-3 text-xs text-blue-800 leading-relaxed">
                  💡 <strong>When to use identify():</strong> Call it right after your user
                  authenticates. Enables targeting by plan, role, or user properties. Without it,
                  FlowLift still works but targets all users equally.
                </div>
              )}

              {!step2Done && (
                <button
                  onClick={completeStep2}
                  className="mt-4 px-4 py-2 text-sm font-medium border border-[#4f6ef7] text-[#4f6ef7] rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Mark as done →
                </button>
              )}
            </StepCard>

            {/* ── Step 3: unlocks when step 2 done ── */}
            <div
              style={{
                maxHeight: step2Done ? "320px" : "0",
                opacity: step2Done ? 1 : 0,
                transform: step2Done ? "translateY(0)" : "translateY(10px)",
                overflow: "hidden",
                transition:
                  "max-height 450ms cubic-bezier(0.16, 1, 0.3, 1), " +
                  "opacity 350ms ease 80ms, " +
                  "transform 350ms ease 80ms",
              }}
            >
              <div className="pt-1">
                <StepCard
                  done={false}
                  active
                  delay={0}
                  title="Create your first flow"
                  body="Use the visual builder to create a welcome message, feature announcement, or upgrade prompt for your users."
                >
                  <Link
                    href="/flows/new"
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#4f6ef7] text-white text-sm font-semibold rounded-lg hover:bg-[#3b5af5] transition-colors"
                  >
                    Open the builder →
                  </Link>
                </StepCard>
              </div>
            </div>

            {/* ── Success state ── */}
            <div
              style={{
                maxHeight: step2Done ? "220px" : "0",
                opacity: step2Done ? 1 : 0,
                overflow: "hidden",
                transition: "max-height 450ms ease 200ms, opacity 400ms ease 380ms",
              }}
            >
              <div className="mt-4 text-center bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100 rounded-2xl py-10 px-6">
                <p className="text-2xl mb-2">🚀</p>
                <p className="text-lg font-bold text-gray-900 mb-1">You&apos;re ready to go</p>
                <p className="text-sm text-gray-500 mb-5">
                  Your first flow is one click away.
                </p>
                <Link
                  href="/flows"
                  className="inline-flex items-center px-5 py-2.5 bg-[#4f6ef7] text-white text-sm font-semibold rounded-lg hover:bg-[#3b5af5] transition-colors shadow-sm"
                >
                  Go to dashboard →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

// ── StepCard ──────────────────────────────────────────────────────────────────

function StepCard({
  done,
  active,
  delay,
  title,
  body,
  children,
}: {
  done: boolean;
  active: boolean;
  delay: number;
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  const borderLeft = done ? "#22c55e" : active ? "#4f6ef7" : "#e2e8f0";

  return (
    <div
      className="bg-white rounded-xl p-6 border border-gray-100 border-l-[3px] shadow-sm"
      style={{
        borderLeftColor: borderLeft,
        transition: "border-left-color 300ms ease",
        animation: `fl-rise 380ms ease ${delay}ms both`,
      }}
    >
      <div className="flex items-start gap-3">
        {done && (
          <span className="flex-none w-5 h-5 mt-0.5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[10px] font-bold">
            ✓
          </span>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
