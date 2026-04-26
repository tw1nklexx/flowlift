"use client";

import { useEffect, useState, useRef } from "react";

type Phase = "problem" | "builder" | "live" | "stats";
type PublishState = "idle" | "hover" | "pressed" | "published";
type BtnState     = "idle" | "hover" | "pressed";
type LiveCursor   = "hidden" | "button" | "nav";
type BuildCursor  = "hidden" | "title" | "publish";

const ADDR: Record<Phase, string> = {
  problem: "app.yourproduct.com/dashboard",
  builder: "nudgify.app/flows/new",
  live:    "app.yourproduct.com/dashboard",
  stats:   "nudgify.app/stats",
};

const TITLE_TEXT = "Welcome to the app!";
const FADE = 300;

interface Ripple { id: number; x: number; y: number; }

// Standalone cursor — rendered inside content area, absolute-positioned
function FakeCursor({ dark = false }: { dark?: boolean }) {
  return (
    <svg
      width="24" height="24" viewBox="0 0 24 24" fill="none"
      style={{ filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.55))" }}
    >
      <path
        d="M1 1L1 17L5.5 13L8.5 20L11 19L8 12L13 12Z"
        fill={dark ? "#111827" : "white"}
        stroke={dark ? "white" : "#1a1a1a"}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AnimatedHeroMockup() {
  const [phase, setPhase] = useState<Phase>("problem");
  const [vis,   setVis]   = useState(true);
  const [addr,  setAddr]  = useState(ADDR.problem);
  const [cycle, setCycle] = useState(0);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleCounter = useRef(0);

  // ACT 2 — builder
  const [typed,        setTyped]        = useState("");
  const [buildCursor,  setBuildCursor]  = useState<BuildCursor>("hidden");
  const [publishState, setPublishState] = useState<PublishState>("idle");

  // ACT 3 — live
  const [liveCursor,   setLiveCursor]   = useState<LiveCursor>("hidden");
  const [btnState,     setBtnState]     = useState<BtnState>("idle");
  const [modalOut,     setModalOut]     = useState(false);
  const [showTip3,     setShowTip3]     = useState(false);
  const [navHighlight, setNavHighlight] = useState(false);
  const [showSuccess3, setShowSuccess3] = useState(false);

  // ACT 4 — stats
  const [causeBanner,   setCauseBanner]   = useState(false);
  const [impressions,   setImpressions]   = useState(12);
  const [completions,   setCompletions]   = useState(5);
  const [rate,          setRate]          = useState(42);
  const [aboveAvgBadge, setAboveAvgBadge] = useState(false);

  const rafRef = useRef<number>(0);

  // Add a ripple at (x, y) within the content area, auto-removes after 450ms
  const addRipple = (x: number, y: number) => {
    const id = rippleCounter.current++;
    setRipples((r) => [...r, { id, x, y }]);
    setTimeout(() => setRipples((r) => r.filter((rr) => rr.id !== id)), 450);
  };

  useEffect(() => {
    const T: ReturnType<typeof setTimeout>[] = [];
    const IV: ReturnType<typeof setInterval>[] = [];
    let raf = 0;

    const add = (fn: () => void, ms: number) => T.push(setTimeout(fn, ms));

    // Fade-out → switch phase → fade-in helper
    const to = (next: Phase, at: number) => {
      add(() => setVis(false), at - FADE);
      add(() => { setPhase(next); setAddr(ADDR[next]); setVis(true); }, at);
    };

    // ─── Hard reset all state ───────────────────────────────────────
    setPhase("problem"); setAddr(ADDR.problem); setVis(true);
    setTyped(""); setBuildCursor("hidden"); setPublishState("idle");
    setLiveCursor("hidden"); setBtnState("idle"); setModalOut(false);
    setShowTip3(false); setNavHighlight(false); setShowSuccess3(false);
    setCauseBanner(false); setAboveAvgBadge(false);
    setImpressions(12); setCompletions(5); setRate(42);
    setRipples([]);
    cancelAnimationFrame(rafRef.current);

    // ─── Phase transitions ──────────────────────────────────────────
    // ACT 1: problem   0      → 2000ms
    // ACT 2: builder   2000ms → 5000ms
    // ACT 3: live      5000ms → 8000ms
    // ACT 4: stats     8000ms → 11000ms
    // fade & loop:     10700ms → 11000ms

    to("builder", 2000);
    to("live",    5000);
    to("stats",   8000);
    add(() => setVis(false),              10700);
    add(() => setCycle((c) => c + 1),    11000);

    // ─── ACT 2: Builder interactions ───────────────────────────────
    // cursor appears at title field
    add(() => setBuildCursor("title"),  2200);
    // typing starts ~200ms after cursor lands
    add(() => {
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setTyped(TITLE_TEXT.slice(0, i));
        if (i >= TITLE_TEXT.length) clearInterval(iv);
      }, 65); // 19 chars × 65ms ≈ 1235ms
      IV.push(iv);
    }, 2400);
    // cursor moves to Publish button (after typing: 2400 + 1235 = ~3635ms)
    add(() => setBuildCursor("publish"), 3700);
    // hover state on Publish
    add(() => setPublishState("hover"),   3850);
    // pressed state + ripple
    add(() => {
      setPublishState("pressed");
      addRipple(453, 17); // Publish button: far right of builder top bar
    }, 4000);
    // button flashes green
    add(() => setPublishState("published"), 4180);

    // ─── ACT 3: Live interactions ───────────────────────────────────
    // ensure modal is visible after phase fade-in
    add(() => setModalOut(false), 5050);
    // cursor appears near modal, moves to "Show me →"
    add(() => setLiveCursor("button"),  5500);
    // hover on button
    add(() => setBtnState("hover"),     6000);
    // click — pressed + ripple
    add(() => {
      setBtnState("pressed");
      addRipple(192, 197); // "Show me →" button inside centered modal
    }, 6150);
    // modal fades out, reset button state
    add(() => { setModalOut(true); setBtnState("idle"); }, 6280);
    // tooltip slides in
    add(() => setShowTip3(true), 6480);
    // cursor moves to Projects nav item
    add(() => setLiveCursor("nav"),     6700);
    // nav click + ripple
    add(() => {
      setNavHighlight(true);
      addRipple(58, 88); // Projects nav item in sidebar
    }, 7000);
    // success badge
    add(() => setShowSuccess3(true), 7180);

    // ─── ACT 4: Stats with cause-effect ────────────────────────────
    // cause banner slides in
    add(() => setCauseBanner(true), 8200);
    // "before" values (12, 5, 42) already set from reset above
    // start counter animation 800ms in
    add(() => {
      const duration = 1800;
      const start = Date.now();
      const frame = () => {
        const p = Math.min((Date.now() - start) / duration, 1);
        const e = 1 - (1 - p) ** 3; // ease-out cubic
        setImpressions(Math.round(12 + (47 - 12) * e));
        setCompletions(Math.round(5  + (31 - 5)  * e));
        setRate(        Math.round(42 + (66 - 42) * e));
        if (p < 1) { raf = requestAnimationFrame(frame); }
      };
      raf = requestAnimationFrame(frame);
    }, 9000);
    // "above avg" badge appears near end of animation
    add(() => setAboveAvgBadge(true), 10600);

    return () => {
      T.forEach(clearTimeout);
      IV.forEach(clearInterval);
      cancelAnimationFrame(raf);
    };
  }, [cycle]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cursor transform for ACT 2 (relative to content area top-left)
  const build2XY =
    buildCursor === "title"   ? "translate(148px, 135px)" :
    buildCursor === "publish" ? "translate(420px, 8px)"   :
                                "translate(160px, 80px)";

  // Cursor transform for ACT 3
  const live3XY =
    liveCursor === "button" ? "translate(170px, 185px)" :
    liveCursor === "nav"    ? "translate(40px,  76px)"  :
                              "translate(160px, 160px)";

  // Shared sidebar skeleton (used in ACT 1 and ACT 3)
  const SidebarSkeleton = ({ highlightIdx = -1 }: { highlightIdx?: number }) => (
    <div className="w-[116px] shrink-0 bg-[#111118] border-r border-white/[0.05] flex flex-col p-2.5">
      <div className="flex items-center gap-2 px-2 py-1.5 mb-3">
        <div className="w-5 h-5 rounded-md shrink-0" style={{ background: "linear-gradient(135deg,#4f6ef7,#7c3aed)" }} />
        <div className="h-2 w-14 bg-white/20 rounded-sm" />
      </div>
      {["Overview", "Projects", "Analytics", "Settings"].map((label, i) => (
        <div
          key={label}
          className={`flex items-center gap-2 px-2 py-1.5 rounded-md mb-0.5 transition-all duration-300 ${
            i === highlightIdx
              ? "bg-[#4f6ef7]/25 ring-1 ring-[#4f6ef7]/50"
              : i === 0 ? "bg-white/[0.06]" : ""
          }`}
        >
          <div className={`w-3 h-3 rounded-[3px] shrink-0 ${i === highlightIdx ? "bg-[#4f6ef7]/80" : "bg-white/10"}`} />
          <div
            className={`h-1.5 rounded-sm ${i === highlightIdx ? "bg-[#4f6ef7]/60" : "bg-white/10"}`}
            style={{ width: [52, 60, 52, 44][i] }}
          />
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
  );

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
            {phase === "live" && (
              <div
                className="flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 rounded-full px-2 py-0.5"
                style={{ animation: "nudge-modal-in 0.3s ease-out forwards" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: "nudge-pulse-glow 1s ease-in-out infinite" }} />
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

          {/* Click ripples — rendered over everything */}
          {ripples.map((r) => (
            <div
              key={r.id}
              className="absolute z-[60] rounded-full border-[1.5px] border-[#4f6ef7]/50"
              style={{
                left: r.x - 10, top: r.y - 10,
                width: 20, height: 20,
                animation: "ripple-expand 0.45s ease-out forwards",
              }}
            />
          ))}

          {/* ══════════════════════════════════════════════════
              ACT 1 — Problem: empty SaaS dashboard
          ══════════════════════════════════════════════════ */}
          {phase === "problem" && (
            <div className="flex h-full bg-[#0f0f13]">
              <SidebarSkeleton />
              <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="3" y="3" width="18" height="18" rx="3" /><path d="M9 9h6M9 12h6M9 15h3" />
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
                <FakeCursor />
              </div>
              <p className="absolute bottom-3 left-3 text-[10px] italic text-gray-600">User signs up...</p>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              ACT 2 — Builder: creating the flow
          ══════════════════════════════════════════════════ */}
          {phase === "builder" && (
            <div className="flex flex-col h-full bg-gray-50">
              {/* Top bar */}
              <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-gray-200 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded" style={{ background: "linear-gradient(135deg,#4f6ef7,#7c3aed)" }} />
                  <span className="text-[11px] font-semibold text-gray-700">Untitled Flow</span>
                </div>
                {/* Publish button with interaction states */}
                <div
                  className="px-2.5 py-1 rounded-md text-[10px] font-semibold text-white"
                  style={{
                    background: publishState === "published" ? "#16a34a" : "#4f6ef7",
                    transform:  publishState === "pressed"   ? "scale(0.93)"   : "scale(1)",
                    filter:     publishState === "hover" || publishState === "pressed"
                      ? "brightness(0.86)" : "brightness(1)",
                    boxShadow:  publishState === "hover"
                      ? "0 0 0 3px rgba(79,110,247,0.3), 0 4px 14px rgba(79,110,247,0.35)"
                      : "none",
                    transition: "background 0.25s ease, transform 0.08s ease, filter 0.12s ease, box-shadow 0.2s ease",
                  }}
                >
                  {publishState === "published" ? "Published ✓" : "Publish"}
                </div>
              </div>

              {/* 3-column builder */}
              <div className="flex flex-1 overflow-hidden">
                {/* Steps */}
                <div className="w-[86px] shrink-0 bg-white border-r border-gray-100 p-2">
                  <p className="text-[8px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">Steps</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-1.5 flex items-center gap-1.5">
                    <div className="w-4 h-4 shrink-0 rounded bg-[#4f6ef7]/15 flex items-center justify-center text-[8px] text-[#4f6ef7] font-bold">1</div>
                    <span className="text-[9px] text-gray-700 truncate">Welcome! 👋</span>
                  </div>
                </div>

                {/* Preview */}
                <div className="flex-1 bg-gray-100 flex items-center justify-center p-3 relative">
                  <p className="absolute top-2 left-0 right-0 text-center text-[8px] font-medium text-gray-400 uppercase tracking-wider">Preview</p>
                  <div className="bg-white rounded-xl shadow-lg p-3 w-full" style={{ maxWidth: 188 }}>
                    <p className="text-[10px] font-bold text-gray-900 mb-1 min-h-[14px] flex items-center">
                      {typed}
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

                {/* Style panel */}
                <div className="w-[78px] shrink-0 bg-white border-l border-gray-100 p-2">
                  <p className="text-[8px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">Style</p>
                  <div className="space-y-1.5">
                    {[42, 30, 38, 24, 34, 20].map((w, i) => (
                      <div key={i} className="h-1.5 bg-gray-100 rounded-sm" style={{ width: w }} />
                    ))}
                  </div>
                </div>
              </div>

              <p className="absolute bottom-3 left-3 text-[10px] italic text-gray-400">
                {publishState === "published" ? "Flow published!" : "Building onboarding flow..."}
              </p>

              {/* Builder cursor */}
              {buildCursor !== "hidden" && (
                <div
                  className="absolute z-50 top-0 left-0"
                  style={{
                    transform: build2XY,
                    transition: "transform 0.55s cubic-bezier(0.34, 1.2, 0.64, 1)",
                  }}
                >
                  <FakeCursor dark />
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              ACT 3 — Live: flow appears on their SaaS
          ══════════════════════════════════════════════════ */}
          {phase === "live" && (
            <div className="flex h-full bg-[#0f0f13] relative">
              <SidebarSkeleton highlightIdx={navHighlight ? 1 : -1} />

              {/* Faded dashboard bg */}
              <div className="flex-1 p-3.5 opacity-30">
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[0, 1, 2].map((i) => <div key={i} className="h-14 rounded-xl bg-white/[0.04] border border-white/[0.06]" />)}
                </div>
                <div className="h-32 rounded-xl bg-white/[0.04] border border-white/[0.06]" />
              </div>

              {/* Modal overlay */}
              {!modalOut && (
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
                    {/* "Show me →" with hover/press states */}
                    <div
                      className="text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-full inline-block"
                      style={{
                        background: "#4f6ef7",
                        filter:    btnState === "idle" ? "brightness(1)" : "brightness(0.84)",
                        transform: btnState === "pressed" ? "scale(0.93)" : "scale(1)",
                        transition: "filter 0.12s ease, transform 0.08s ease",
                      }}
                    >
                      Show me →
                    </div>
                    {/* Watermark */}
                    <div className="absolute bottom-2 right-2.5 flex items-center gap-1 opacity-35">
                      <div className="w-2 h-2 rounded-sm" style={{ background: "linear-gradient(135deg,#4f6ef7,#7c3aed)" }} />
                      <span className="text-[7px] text-gray-400">Nudgify</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tooltip after modal dismissed */}
              {showTip3 && (
                <div
                  className="absolute z-20"
                  style={{ top: 74, left: 122, animation: "nudge-tooltip-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
                >
                  <div className="relative">
                    <div
                      className="absolute -left-[7px] top-3.5"
                      style={{ width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderRight: "7px solid #1a1a2e" }}
                    />
                    <div
                      className="rounded-xl px-3 py-2 border border-white/10"
                      style={{ background: "linear-gradient(135deg,#1a1a2e,#16162a)", boxShadow: "0 8px 24px rgba(0,0,0,0.5)", minWidth: 176 }}
                    >
                      <p className="text-[10px] font-medium text-white leading-snug">
                        Now click here to create your first project →
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Success badge */}
              {showSuccess3 && (
                <div
                  className="absolute top-2 right-2 z-30 flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/30 rounded-full px-2.5 py-1"
                  style={{ animation: "nudge-modal-in 0.3s ease-out forwards" }}
                >
                  <span className="text-[9px] font-semibold text-emerald-400">✓ First action completed</span>
                </div>
              )}

              <p className="absolute bottom-3 left-3 z-20 text-[10px] font-medium text-emerald-400">Flow is live instantly ✓</p>

              {/* Live cursor */}
              {liveCursor !== "hidden" && (
                <div
                  className="absolute z-50 top-0 left-0"
                  style={{
                    transform: live3XY,
                    transition: "transform 0.55s cubic-bezier(0.34, 1.2, 0.64, 1)",
                  }}
                >
                  <FakeCursor />
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              ACT 4 — Stats: direct result of click in ACT 3
          ══════════════════════════════════════════════════ */}
          {phase === "stats" && (
            <div className="h-full bg-gray-50 flex flex-col">
              {/* Cause-effect banner */}
              {causeBanner && (
                <div
                  className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-blue-50 border-b border-blue-100/80"
                  style={{ animation: "nudge-banner-in 0.35s cubic-bezier(0.34, 1.4, 0.64, 1) forwards" }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-[#4f6ef7] shrink-0"
                    style={{ animation: "nudge-pulse-glow 1.2s ease-in-out infinite" }}
                  />
                  <span className="text-[9px] font-medium text-blue-700">
                    1 new completion just recorded — from your live flow
                  </span>
                </div>
              )}

              <div className="flex-1 p-4 flex flex-col min-h-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-4 h-4 rounded" style={{ background: "linear-gradient(135deg,#4f6ef7,#7c3aed)" }} />
                  <p className="text-[12px] font-bold text-gray-800">Flow Analytics</p>
                  <span className="ml-auto text-[9px] text-gray-400">Last 7 days</span>
                </div>

                {/* Stat cards — animate from before values to target */}
                <div className="grid grid-cols-3 gap-2 mb-3.5">
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

                {/* Completion rate bar */}
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
                          {aboveAvgBadge && (
                            <span
                              className="text-[7px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-px rounded-full"
                              style={{ animation: "nudge-modal-in 0.3s ease-out forwards" }}
                            >
                              ↑ above avg
                            </span>
                          )}
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

                <p className="mt-2.5 text-[10px] font-medium text-emerald-500">Activation improved 📈</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
