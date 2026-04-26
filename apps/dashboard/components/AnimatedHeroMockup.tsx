"use client";

import { useEffect, useState, useRef } from "react";

type Phase = "problem" | "builder" | "live" | "stats";

const ADDR: Record<Phase, string> = {
  problem: "app.yourproduct.com/dashboard",
  builder: "nudgify.app/flows/new",
  live:    "app.yourproduct.com/dashboard",
  stats:   "nudgify.app/stats",
};

const TITLE_TEXT = "Welcome to the app!";
const FADE = 300;

export function AnimatedHeroMockup() {
  const [phase, setPhase]           = useState<Phase>("problem");
  const [vis, setVis]               = useState(true);
  const [addr, setAddr]             = useState(ADDR.problem);
  const [cycle, setCycle]           = useState(0);

  // Builder state
  const [typedTitle, setTypedTitle]         = useState("");
  const [publishGlow, setPublishGlow]       = useState(false);
  const [cursorStep, setCursorStep]         = useState<"idle" | "title" | "publish">("idle");

  // Stats state
  const [impressions, setImpressions] = useState(0);
  const [completions, setCompletions] = useState(0);
  const [rate, setRate]               = useState(0);

  const rafRef = useRef<number>(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    const add = (fn: () => void, delay: number) => {
      const id = setTimeout(fn, delay);
      timers.push(id);
    };

    // Fade out → switch phase → fade in
    const to = (next: Phase, at: number) => {
      add(() => setVis(false), at - FADE);
      add(() => { setPhase(next); setAddr(ADDR[next]); setVis(true); }, at);
    };

    // Reset all state
    setPhase("problem");
    setAddr(ADDR.problem);
    setVis(true);
    setTypedTitle("");
    setPublishGlow(false);
    setCursorStep("idle");
    setImpressions(0);
    setCompletions(0);
    setRate(0);
    cancelAnimationFrame(rafRef.current);

    // ── Timeline ──────────────────────────────────────────
    // ACT 1: problem  0 → 2000ms
    // ACT 2: builder  2000 → 5000ms
    // ACT 3: live     5000 → 8000ms
    // ACT 4: stats    8000 → 11000ms
    // fade + loop:    10700 → 11000ms

    to("builder", 2000);
    to("live",    5000);
    to("stats",   8000);
    add(() => setVis(false),             10700);
    add(() => setCycle((c) => c + 1),    11000);

    // ── ACT 2 builder animations ──────────────────────────
    // cursor moves to title area
    add(() => setCursorStep("title"), 2200);
    // start typing
    add(() => {
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setTypedTitle(TITLE_TEXT.slice(0, i));
        if (i >= TITLE_TEXT.length) clearInterval(iv);
      }, 75);
      intervals.push(iv);
    }, 2400);
    // cursor moves to publish after typing (~19×75ms = 1425ms from 2400 = 3825ms)
    add(() => setCursorStep("publish"), 3900);
    add(() => setPublishGlow(true),     4050);

    // ── ACT 4 stats counter ───────────────────────────────
    add(() => {
      const duration = 1600;
      const start = Date.now();
      const frame = () => {
        const p = Math.min((Date.now() - start) / duration, 1);
        const ease = 1 - (1 - p) ** 3;
        setImpressions(Math.round(47 * ease));
        setCompletions(Math.round(31 * ease));
        setRate(Math.round(66 * ease));
        if (p < 1) { rafRef.current = requestAnimationFrame(frame); }
      };
      rafRef.current = requestAnimationFrame(frame);
    }, 8300);

    return () => {
      timers.forEach(clearTimeout);
      intervals.forEach(clearInterval);
      cancelAnimationFrame(rafRef.current);
    };
  }, [cycle]);

  // Cursor transform for builder phase
  const cursorXY =
    cursorStep === "title"   ? "translate(148px, 132px)" :
    cursorStep === "publish" ? "translate(286px, 10px)"  :
                               "translate(160px, 80px)";

  return (
    <div className="relative hidden md:block w-full max-w-[540px] pointer-events-none select-none">
      {/* Ambient glow */}
      <div
        className="absolute -inset-6 rounded-[40px] -z-10 bg-gradient-to-br from-blue-600/25 via-purple-600/10 to-blue-400/20 blur-3xl"
        style={{ animation: "nudge-pulse-glow 3s ease-in-out infinite" }}
      />

      {/* Browser shell */}
      <div
        className="rounded-2xl overflow-hidden border border-white/10 bg-[#0f0f13]"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)" }}
      >
        {/* ── Chrome bar ── */}
        <div className="flex items-center gap-2 px-4 py-[11px] bg-[#18181f] border-b border-white/[0.06]">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          <div className="flex-1 flex items-center justify-center gap-2">
            {/* Address bar */}
            <div className="flex items-center gap-1.5 bg-white/[0.05] border border-white/[0.08] rounded-md px-3 py-[3px]">
              <svg className="w-2.5 h-2.5 text-gray-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span
                className="text-[11px] text-gray-500 font-mono tracking-tight"
                style={{ transition: "opacity 0.3s ease", opacity: vis ? 1 : 0 }}
              >
                {addr}
              </span>
            </div>
            {/* Live badge */}
            {phase === "live" && (
              <div
                className="flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 rounded-full px-2 py-0.5"
                style={{ animation: "nudge-modal-in 0.3s ease-out forwards" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  style={{ animation: "nudge-pulse-glow 1s ease-in-out infinite" }}
                />
                <span className="text-[9px] font-semibold text-emerald-400">Live</span>
              </div>
            )}
          </div>
          <div className="w-[52px]" />
        </div>

        {/* ── Content area ── */}
        <div
          className="h-[330px] relative overflow-hidden"
          style={{ transition: `opacity ${FADE}ms ease`, opacity: vis ? 1 : 0 }}
        >

          {/* ══ ACT 1 — Problem: empty SaaS dashboard ══ */}
          {phase === "problem" && (
            <div className="flex h-full bg-[#0f0f13]">
              {/* Sidebar */}
              <div className="w-[116px] shrink-0 bg-[#111118] border-r border-white/[0.05] flex flex-col p-2.5">
                <div className="flex items-center gap-2 px-2 py-1.5 mb-3">
                  <div className="w-5 h-5 rounded-md shrink-0" style={{ background: "linear-gradient(135deg, #4f6ef7, #7c3aed)" }} />
                  <div className="h-2 w-14 bg-white/20 rounded-sm" />
                </div>
                {(["Overview", "Projects", "Analytics", "Settings"] as const).map((label, i) => (
                  <div
                    key={label}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md mb-0.5 ${i === 0 ? "bg-white/[0.06]" : ""}`}
                  >
                    <div className="w-3 h-3 rounded-[3px] shrink-0 bg-white/10" />
                    <div className="h-1.5 rounded-sm bg-white/10" style={{ width: [52, 60, 52, 44][i] }} />
                  </div>
                ))}
                <div className="mt-auto">
                  <div className="h-px bg-white/[0.06] mb-2" />
                  <div className="flex items-center gap-2 px-2 py-1.5">
                    <div className="w-3 h-3 rounded-full bg-white/10 shrink-0" />
                    <div className="h-1.5 w-10 bg-white/10 rounded-sm" />
                  </div>
                </div>
              </div>
              {/* Empty state */}
              <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <path d="M9 9h6M9 12h6M9 15h3" />
                  </svg>
                </div>
                <p className="text-[13px] font-semibold text-gray-400">No projects yet</p>
                <p className="text-[11px] text-gray-600 text-center leading-relaxed" style={{ maxWidth: 160 }}>
                  Create your first project to get started with onboarding flows
                </p>
                <div className="mt-1 rounded-lg bg-white/[0.05] border border-white/[0.07] px-3 py-1.5">
                  <span className="text-[11px] text-gray-500">+ New project</span>
                </div>
              </div>
              {/* Wandering cursor */}
              <div
                className="absolute z-50"
                style={{ bottom: 90, left: 170, animation: "cursor-wander 2s ease-in-out forwards" }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M0 0L0 14L4 10L7 17L9 16L6 9L11 9Z" fill="white" stroke="#333" strokeWidth="1" />
                </svg>
              </div>
              {/* Act label */}
              <p className="absolute bottom-3 left-3 text-[10px] italic text-gray-600">User signs up...</p>
            </div>
          )}

          {/* ══ ACT 2 — Builder: Nudgify flow builder ══ */}
          {phase === "builder" && (
            <div className="flex flex-col h-full bg-gray-50">
              {/* Builder top bar */}
              <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-gray-200 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded" style={{ background: "linear-gradient(135deg, #4f6ef7, #7c3aed)" }} />
                  <span className="text-[11px] font-semibold text-gray-700">Untitled Flow</span>
                </div>
                <div
                  className="px-2.5 py-1 rounded-md text-[10px] font-semibold text-white"
                  style={{
                    background: "#4f6ef7",
                    transition: "box-shadow 0.3s ease",
                    boxShadow: publishGlow
                      ? "0 0 0 3px rgba(79,110,247,0.35), 0 4px 14px rgba(79,110,247,0.5)"
                      : "none",
                  }}
                >
                  Publish
                </div>
              </div>

              {/* 3-column layout */}
              <div className="flex flex-1 overflow-hidden">
                {/* Left: steps */}
                <div className="w-[86px] shrink-0 bg-white border-r border-gray-100 p-2">
                  <p className="text-[8px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">Steps</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-1.5 flex items-center gap-1.5">
                    <div className="w-4 h-4 shrink-0 rounded bg-[#4f6ef7]/15 flex items-center justify-center text-[8px] text-[#4f6ef7] font-bold">1</div>
                    <span className="text-[9px] text-gray-700 truncate">Welcome! 👋</span>
                  </div>
                </div>

                {/* Center: preview */}
                <div className="flex-1 bg-gray-100 flex items-center justify-center p-3 relative">
                  <p className="absolute top-2 left-0 right-0 text-center text-[8px] font-medium text-gray-400 uppercase tracking-wider">Preview</p>
                  <div className="bg-white rounded-xl shadow-lg p-3 w-full" style={{ maxWidth: 188 }}>
                    <p className="text-[10px] font-bold text-gray-900 mb-1 min-h-[14px] flex items-center">
                      {typedTitle}
                      <span className="inline-block w-px h-[10px] bg-gray-900 ml-[1px] animate-pulse" />
                    </p>
                    <p className="text-[9px] text-gray-400 mb-2 leading-relaxed">Let us show you around</p>
                    <div className="flex items-center gap-1 mb-2">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className={`rounded-full ${i === 0 ? "w-3 h-1 bg-[#4f6ef7]" : "w-1 h-1 bg-gray-200"}`} />
                      ))}
                    </div>
                    <div className="bg-[#4f6ef7] text-white text-[9px] font-semibold px-2 py-1 rounded-full inline-block">
                      Show me →
                    </div>
                  </div>
                </div>

                {/* Right: properties */}
                <div className="w-[78px] shrink-0 bg-white border-l border-gray-100 p-2">
                  <p className="text-[8px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">Style</p>
                  <div className="space-y-1.5">
                    {[42, 30, 38, 24, 34, 20].map((w, i) => (
                      <div key={i} className="h-1.5 bg-gray-100 rounded-sm" style={{ width: w }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Act label */}
              <p className="absolute bottom-3 left-3 text-[10px] italic text-gray-400">Building onboarding flow...</p>

              {/* Moving cursor */}
              {cursorStep !== "idle" && (
                <div
                  className="absolute z-50 top-0 left-0"
                  style={{
                    transform: cursorXY,
                    transition: "transform 0.55s cubic-bezier(0.34, 1.2, 0.64, 1)",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M0 0L0 14L4 10L7 17L9 16L6 9L11 9Z" fill="#111" stroke="#fff" strokeWidth="1" />
                  </svg>
                </div>
              )}
            </div>
          )}

          {/* ══ ACT 3 — Live: flow appears on their SaaS ══ */}
          {phase === "live" && (
            <div className="flex h-full bg-[#0f0f13] relative">
              {/* Sidebar */}
              <div className="w-[116px] shrink-0 bg-[#111118] border-r border-white/[0.05] flex flex-col p-2.5">
                <div className="flex items-center gap-2 px-2 py-1.5 mb-3">
                  <div className="w-5 h-5 rounded-md shrink-0" style={{ background: "linear-gradient(135deg, #4f6ef7, #7c3aed)" }} />
                  <div className="h-2 w-14 bg-white/20 rounded-sm" />
                </div>
                {(["Overview", "Projects", "Analytics", "Settings"] as const).map((label, i) => (
                  <div key={label} className={`flex items-center gap-2 px-2 py-1.5 rounded-md mb-0.5 ${i === 0 ? "bg-white/[0.06]" : ""}`}>
                    <div className="w-3 h-3 rounded-[3px] shrink-0 bg-white/10" />
                    <div className="h-1.5 rounded-sm bg-white/10" style={{ width: [52, 60, 52, 44][i] }} />
                  </div>
                ))}
                <div className="mt-auto">
                  <div className="h-px bg-white/[0.06] mb-2" />
                  <div className="flex items-center gap-2 px-2 py-1.5">
                    <div className="w-3 h-3 rounded-full bg-white/10 shrink-0" />
                    <div className="h-1.5 w-10 bg-white/10 rounded-sm" />
                  </div>
                </div>
              </div>
              {/* Faded dashboard bg */}
              <div className="flex-1 p-3.5 opacity-30">
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-14 rounded-xl bg-white/[0.04] border border-white/[0.06]" />
                  ))}
                </div>
                <div className="h-32 rounded-xl bg-white/[0.04] border border-white/[0.06]" />
              </div>
              {/* Modal overlay */}
              <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] flex items-center justify-center z-10">
                <div
                  className="bg-white rounded-2xl p-4 w-full relative"
                  style={{
                    maxWidth: 200,
                    animation: "nudge-modal-in 0.45s cubic-bezier(0.34, 1.45, 0.64, 1) forwards",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.07)",
                  }}
                >
                  <p className="text-[11px] font-bold text-gray-900 mb-1">Welcome to the app!</p>
                  <p className="text-[9px] text-gray-400 mb-3 leading-relaxed">Let us show you around</p>
                  <div className="flex items-center gap-1 mb-3">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className={`rounded-full ${i === 0 ? "w-3 h-1 bg-[#4f6ef7]" : "w-1 h-1 bg-gray-200"}`} />
                    ))}
                  </div>
                  <div className="bg-[#4f6ef7] text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-full inline-block">
                    Show me →
                  </div>
                  {/* Nudgify watermark */}
                  <div className="absolute bottom-2 right-2.5 flex items-center gap-1 opacity-35">
                    <div className="w-2 h-2 rounded-sm" style={{ background: "linear-gradient(135deg, #4f6ef7, #7c3aed)" }} />
                    <span className="text-[7px] text-gray-400">Nudgify</span>
                  </div>
                </div>
              </div>
              {/* Act label */}
              <p className="absolute bottom-3 left-3 z-20 text-[10px] font-medium text-emerald-400">Flow is live instantly ✓</p>
            </div>
          )}

          {/* ══ ACT 4 — Stats: activation improving ══ */}
          {phase === "stats" && (
            <div className="h-full bg-gray-50 p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-3.5">
                <div className="w-4 h-4 rounded" style={{ background: "linear-gradient(135deg, #4f6ef7, #7c3aed)" }} />
                <p className="text-[12px] font-bold text-gray-800">Flow Analytics</p>
                <span className="ml-auto text-[9px] text-gray-400">Last 7 days</span>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: "Impressions",     value: impressions, suffix: "" },
                  { label: "Completions",     value: completions, suffix: "" },
                  { label: "Completion rate", value: rate,        suffix: "%" },
                ].map((card) => (
                  <div key={card.label} className="bg-white rounded-xl p-2.5 border border-gray-200 shadow-sm">
                    <p className="text-[8px] text-gray-400 mb-1 leading-tight">{card.label}</p>
                    <p className="text-[18px] font-bold text-gray-900 tabular-nums leading-none">
                      {card.value}{card.suffix}
                    </p>
                  </div>
                ))}
              </div>

              {/* Rate comparison */}
              <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm flex-1">
                <p className="text-[9px] font-semibold text-gray-500 mb-2.5">Completion rate vs industry</p>
                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[8px] text-gray-400">Industry avg</span>
                      <span className="text-[8px] text-gray-400">38%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full">
                      <div className="h-full bg-gray-300 rounded-full" style={{ width: "38%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[8px] font-semibold text-gray-700">Your rate</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[7px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-px rounded-full">
                          ↑ above avg
                        </span>
                        <span className="text-[8px] font-bold text-[#4f6ef7] tabular-nums">{rate}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#4f6ef7] rounded-full"
                        style={{ width: `${rate}%`, transition: "width 16ms linear" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Act label */}
              <p className="mt-2.5 text-[10px] font-medium text-emerald-500">Activation improved 📈</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
