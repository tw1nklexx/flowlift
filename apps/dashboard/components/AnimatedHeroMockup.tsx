"use client";

import { useEffect, useState, useRef } from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";

type Phase = "problem" | "modal" | "tooltip" | "success" | "fadeout";

const NAV_ITEMS = [
  { label: "Overview",  active: false, w: 52 },
  { label: "Dashboard", active: true,  w: 64 },
  { label: "Analytics", active: false, w: 52 },
  { label: "Settings",  active: false, w: 44 },
];

const STAT_CARDS = [
  { label: "Impressions", value: "0",    sub: "this week",  accent: "from-[#4f6ef7]/15", isCounter: true },
  { label: "Activation",  value: "68%",  sub: "+8pts",      accent: "from-purple-500/15", isCounter: false },
  { label: "Flows live",  value: "4",    sub: "2 new",      accent: "from-emerald-500/15", isCounter: false },
];

const TABLE_ROWS = [
  { name: "Sarah K.",   plan: "Free", status: true  },
  { name: "James R.",   plan: "Pro",  status: true  },
  { name: "Liu Wei",    plan: "Free", status: false },
  { name: "Ana Torres", plan: "Pro",  status: true  },
  { name: "Dmitri V.",  plan: "Free", status: false },
];

export function AnimatedHeroMockup() {
  const [phase, setPhase] = useState<Phase>("problem");
  const [cycle, setCycle] = useState(0);
  const [modalExiting, setModalExiting] = useState(false);
  const [impressions, setImpressions] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // Clear all previous timers
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    const t = (...args: Parameters<typeof setTimeout>) => {
      const id = setTimeout(...args);
      timersRef.current.push(id);
      return id;
    };

    setImpressions(0);
    setModalExiting(false);

    if (cycle === 0) {
      // First cycle: show "problem" act
      setPhase("problem");
      t(() => setPhase("modal"), 2000);
      t(() => setModalExiting(true), 4700);
      t(() => { setPhase("tooltip"); setModalExiting(false); }, 5000);
      t(() => setPhase("success"), 8000);
      t(() => setPhase("fadeout"), 11000);
      t(() => setCycle((c) => c + 1), 12000);
    } else {
      // Subsequent cycles: skip "problem", start from modal
      setPhase("modal");
      t(() => setModalExiting(true), 2700);
      t(() => { setPhase("tooltip"); setModalExiting(false); }, 3000);
      t(() => setPhase("success"), 6000);
      t(() => setPhase("fadeout"), 9000);
      t(() => setCycle((c) => c + 1), 10000);
    }

    return () => timersRef.current.forEach(clearTimeout);
  }, [cycle]);

  // Counter animation when "success" phase begins
  useEffect(() => {
    if (phase !== "success") return;
    setImpressions(0);
    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      setImpressions(count);
      if (count >= 24) clearInterval(interval);
    }, 42); // 0→24 over ~1s
    return () => clearInterval(interval);
  }, [phase]);

  const showProblem  = phase === "problem";
  const showModal    = phase === "modal" || (phase === "tooltip" && modalExiting);
  const showTooltip  = phase === "tooltip" && !modalExiting;
  const showBanner   = phase === "success" || phase === "fadeout";
  const showFadeout  = phase === "fadeout";

  // Highlight "Analytics" nav item during tooltip phase
  const navItems = NAV_ITEMS.map((item) =>
    item.label === "Analytics" && (phase === "tooltip" || phase === "success")
      ? { ...item, active: true, highlight: true }
      : { ...item, highlight: false }
  );

  return (
    <div className="relative hidden md:block w-full max-w-[540px]">
      {/* Ambient glow */}
      <div
        className="absolute -inset-6 rounded-[40px] -z-10 bg-gradient-to-br from-blue-600/25 via-purple-600/10 to-blue-400/20 blur-3xl"
        style={{ animation: "nudge-pulse-glow 3s ease-in-out infinite" }}
      />

      {/* Browser shell */}
      <div
        className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0f0f13]"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)" }}
      >
        {/* Chrome bar */}
        <div className="flex items-center gap-2 px-4 py-[11px] bg-[#18181f] border-b border-white/[0.06]">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-1.5 bg-white/[0.05] border border-white/[0.08] rounded-md px-3 py-[3px]">
              <svg className="w-2.5 h-2.5 text-gray-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="text-[11px] text-gray-500 font-mono tracking-tight">app.yourproduct.com</span>
            </div>
          </div>
          <div className="w-[52px]" />
        </div>

        {/* App content */}
        <div className="flex h-[330px] relative overflow-hidden">

          {/* Sidebar */}
          <div className="w-[116px] shrink-0 bg-[#111118] border-r border-white/[0.05] flex flex-col p-2.5">
            {/* Logo row */}
            <div className="flex items-center gap-2 px-2 py-1.5 mb-3">
              <div className="w-5 h-5 rounded-md shrink-0" style={{ background: "linear-gradient(135deg, #4f6ef7, #7c3aed)" }} />
              <div className="h-2 w-14 bg-white/20 rounded-sm" />
            </div>

            {/* Nav items */}
            {navItems.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md mb-0.5 transition-all duration-300 ${
                  item.highlight
                    ? "bg-[#4f6ef7]/25 ring-1 ring-[#4f6ef7]/50"
                    : item.active && !item.highlight
                    ? "bg-[#4f6ef7]/20 ring-1 ring-[#4f6ef7]/30"
                    : ""
                }`}
                style={item.highlight ? { animation: "nav-pulse 1.5s ease-in-out infinite" } : undefined}
              >
                <div
                  className={`w-3 h-3 rounded-[3px] shrink-0 ${
                    item.active || item.highlight ? "bg-[#4f6ef7]/80" : "bg-white/10"
                  }`}
                />
                <div
                  className={`h-1.5 rounded-sm ${item.active || item.highlight ? "bg-[#4f6ef7]/60" : "bg-white/10"}`}
                  style={{ width: item.w }}
                />
              </div>
            ))}

            <div className="mt-auto space-y-0.5">
              <div className="h-px bg-white/[0.06] mb-2" />
              <div className="flex items-center gap-2 px-2 py-1.5">
                <div className="w-3 h-3 rounded-full bg-white/10 shrink-0" />
                <div className="h-1.5 w-10 bg-white/10 rounded-sm" />
              </div>
            </div>
          </div>

          {/* Main panel */}
          <div className="flex-1 bg-[#0f0f13] flex flex-col p-3.5 overflow-hidden relative">

            {/* Success banner */}
            {showBanner && (
              <div
                className="absolute top-0 left-0 right-0 z-20 flex items-center gap-2 px-3.5 py-2 bg-emerald-500 text-white"
                style={{ animation: "nudge-banner-in 0.4s cubic-bezier(0.34, 1.4, 0.64, 1) forwards" }}
              >
                <CheckCircle2 size={12} className="shrink-0" />
                <span className="text-[10px] font-semibold">
                  Your first flow is live! 24 users reached this week.
                </span>
              </div>
            )}

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-2.5 mb-3.5 mt-0.5">
              {STAT_CARDS.map((card) => (
                <div
                  key={card.label}
                  className={`rounded-xl p-2.5 border border-white/[0.06] relative overflow-hidden bg-gradient-to-br ${card.accent} to-transparent`}
                >
                  <div
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent"
                    style={{ animation: "nudge-shimmer 2.5s ease-in-out infinite" }}
                  />
                  <p className="text-[9px] text-gray-500 mb-0.5 relative">{card.label}</p>
                  <p className="text-sm font-bold text-white relative tabular-nums">
                    {card.isCounter ? impressions : card.value}
                  </p>
                  <p className="text-[9px] text-emerald-400 relative mt-0.5">{card.sub}</p>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="flex-1 rounded-xl border border-white/[0.06] overflow-hidden">
              <div className="flex items-center gap-3 px-3 py-2 border-b border-white/[0.06] bg-white/[0.02]">
                {["User", "Plan", "Status"].map((h) => (
                  <span key={h} className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider flex-1 first:flex-[2]">
                    {h}
                  </span>
                ))}
              </div>
              {TABLE_ROWS.map((row, i) => (
                <div
                  key={row.name}
                  className="flex items-center gap-3 px-3 py-1.5 border-b border-white/[0.03] last:border-0"
                  style={{ opacity: 1 - i * 0.12 }}
                >
                  <div className="flex items-center gap-1.5 flex-[2]">
                    <div
                      className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center text-[7px] font-bold text-white"
                      style={{ background: `hsl(${i * 60 + 200}, 60%, 50%)` }}
                    >
                      {row.name[0]}
                    </div>
                    <span className="text-[10px] text-gray-400 truncate">{row.name}</span>
                  </div>
                  <span className="text-[10px] flex-1" style={{ color: row.plan === "Pro" ? "#a78bfa" : "#6b7280" }}>
                    {row.plan}
                  </span>
                  <div className="flex-1">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                        row.status ? "bg-emerald-500/15 text-emerald-400" : "bg-white/5 text-gray-500"
                      }`}
                    >
                      {row.status ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── ACT 1: Problem overlay + wandering cursor ── */}
          {showProblem && (
            <>
              {/* Cursor */}
              <div
                className="absolute z-20 pointer-events-none"
                style={{
                  bottom: 80,
                  left: 180,
                  animation: "cursor-wander 2s ease-in-out forwards",
                }}
              >
                <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
                  <path d="M1 1L1 17L5.5 13L8 19L10 18L7.5 12H13L1 1Z" fill="white" stroke="#333" strokeWidth="1.2" strokeLinejoin="round"/>
                </svg>
                {/* Red confusion dot */}
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 border border-[#0f0f13]" />
              </div>
              {/* Label */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20 pointer-events-none">
                <span className="text-[10px] italic text-gray-400 bg-[#0f0f13]/80 px-2 py-1 rounded-md">
                  Without Nudgify — users get lost
                </span>
              </div>
            </>
          )}

          {/* ── ACT 2: Modal overlay ── */}
          {showModal && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center z-10">
              <div
                className="bg-white rounded-2xl shadow-2xl p-5 mx-8 w-full max-w-[230px] relative"
                style={{
                  animation: modalExiting
                    ? "nudge-modal-out 0.35s ease-in forwards"
                    : "nudge-modal-in 0.45s cubic-bezier(0.34, 1.45, 0.64, 1) forwards",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.08)",
                }}
              >
                {/* Nudgify watermark */}
                <div className="absolute top-2 right-3 flex items-center gap-1 opacity-30">
                  <div className="w-2 h-2 rounded-sm" style={{ background: "linear-gradient(135deg, #4f6ef7, #7c3aed)" }} />
                  <span className="text-[7px] text-gray-400 font-medium">Nudgify</span>
                </div>

                <div className="flex items-start gap-2.5 mb-3.5">
                  <span className="shrink-0 w-8 h-8 rounded-xl bg-[#4f6ef7]/10 flex items-center justify-center">
                    <Sparkles size={14} className="text-[#4f6ef7]" />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold text-gray-900 leading-tight mb-0.5">
                      Welcome to your dashboard! 👋
                    </p>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      Let us show you around in 2 minutes.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`rounded-full transition-all ${
                        i === 0 ? "w-4 h-1.5 bg-[#4f6ef7]" : "w-1.5 h-1.5 bg-gray-200"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button className="text-[10px] font-semibold bg-[#4f6ef7] text-white px-3 py-1.5 rounded-full shadow-sm shadow-blue-200">
                    Show me →
                  </button>
                  <span className="text-[10px] text-gray-400">Skip for now</span>
                </div>
              </div>

              {/* "With Nudgify" label */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
                <span className="text-[10px] font-medium text-emerald-400 bg-[#0f0f13]/80 px-2 py-1 rounded-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  With Nudgify — users get guided
                </span>
              </div>
            </div>
          )}

          {/* ── ACT 3: Tooltip pointing at Analytics nav item ── */}
          {showTooltip && (
            <div
              className="absolute z-20"
              style={{
                top: 108,
                left: 120,
                animation: "nudge-tooltip-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              }}
            >
              <div className="relative">
                {/* Arrow pointing left toward nav */}
                <div
                  className="absolute -left-[7px] top-4"
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: "6px solid transparent",
                    borderBottom: "6px solid transparent",
                    borderRight: "7px solid #1a1a2e",
                  }}
                />
                <div
                  className="rounded-xl px-3 py-2.5 border border-white/10"
                  style={{
                    background: "linear-gradient(135deg, #1a1a2e 0%, #16162a 100%)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)",
                    minWidth: 160,
                  }}
                >
                  <p className="text-[10px] font-semibold text-white leading-snug mb-1">
                    Start here — check your analytics
                  </p>
                  <p className="text-[9px] text-gray-400 mb-2">See how users interact with your flows.</p>
                  <div className="flex items-center justify-between">
                    <button className="text-[9px] font-semibold bg-[#4f6ef7] text-white px-2 py-1 rounded-full">
                      Got it →
                    </button>
                    <span className="text-[9px] text-gray-500">2 of 3</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Fadeout overlay ── */}
          {showFadeout && (
            <div
              className="absolute inset-0 bg-[#0f0f13] z-30"
              style={{ animation: "nudge-fadeout-overlay 0.6s ease-in forwards" }}
            />
          )}

        </div>
      </div>
    </div>
  );
}
