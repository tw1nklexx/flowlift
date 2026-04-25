"use client";

import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";

type Placement = "center" | "right" | "left" | "bottom" | "top" | "inner-top";

interface TourStep {
  target?: string;
  placement: Placement;
  title: string;
  body: string;
  cta: string;
}

const STEPS: TourStep[] = [
  {
    placement: "center",
    title: "What is a flow? 🎯",
    body: "A flow is an onboarding experience your users see on your app.\nIt can be a welcome message, a feature announcement, or a prompt to upgrade — shown at exactly the right moment.",
    cta: "Got it →",
  },
  {
    target: "templates",
    placement: "inner-top",
    title: "Start from a template",
    body: "Pick a template to get started in one click. Each template is pre-configured with steps and targeting rules — just customize the text and publish.",
    cta: "Makes sense →",
  },
  {
    target: "flows-list",
    placement: "inner-top",
    title: "Your published flows",
    body: "Active flows are live on your app right now. Draft flows are saved but not shown to users yet. Click Edit to make changes — no deployment needed.",
    cta: "Got it →",
  },
  {
    target: "new-flow-btn",
    placement: "bottom",
    title: "Build from scratch",
    body: "Click '+ New Flow' to open the visual builder.\nAdd modals, tooltips, and banners — preview instantly, publish in one click.",
    cta: "Got it →",
  },
  {
    target: "ai-btn",
    placement: "bottom",
    title: "Generate a flow with AI ✨",
    body: "Describe what you want in plain English and AI will build the flow for you in seconds.\nExample: \"Welcome new users and show them the main features\"",
    cta: "Cool →",
  },
  {
    target: "stats-link",
    placement: "right",
    title: "Track your results 📊",
    body: "After publishing, go to Stats to see how many users saw your flow, how many completed it, and where they dropped off.\nIndustry average completion: 30–40%.",
    cta: "Let's go! 🚀",
  },
];

const TOOLTIP_W = 292;
const GAP = 14;

export function FlowsPageTour({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [visible, setVisible] = useState(false);

  const current = STEPS[step];

  const updateRect = useCallback(() => {
    if (!current.target) { setRect(null); return; }
    const el = document.querySelector(`[data-tour="${current.target}"]`);
    setRect(el ? el.getBoundingClientRect() : null);
  }, [current.target]);

  useEffect(() => {
    updateRect();
    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, [updateRect]);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, [step]);

  function next() {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else onClose();
  }

  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;

  function tooltipStyle(): React.CSSProperties {
    if (!rect || current.placement === "center") {
      return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    }
    const clampLeft = (v: number) => Math.max(8, Math.min(vw - TOOLTIP_W - 8, v));
    switch (current.placement) {
      case "right":
        return {
          left: rect.right + GAP,
          top: Math.max(8, Math.min(vh - 260, rect.top + rect.height / 2 - 100)),
        };
      case "left":
        return {
          left: clampLeft(rect.left - TOOLTIP_W - GAP),
          top: Math.max(8, Math.min(vh - 260, rect.top + rect.height / 2 - 100)),
        };
      case "bottom":
        return {
          top: rect.bottom + GAP,
          left: clampLeft(rect.left + rect.width / 2 - TOOLTIP_W / 2),
        };
      case "top":
        return {
          bottom: vh - rect.top + GAP,
          left: clampLeft(rect.left + rect.width / 2 - TOOLTIP_W / 2),
        };
      case "inner-top":
        return {
          top: rect.top + GAP,
          left: clampLeft(rect.left + rect.width / 2 - TOOLTIP_W / 2),
        };
      default:
        return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    }
  }

  const pl = current.placement;
  const showArrow = !!rect && pl !== "center" && pl !== "inner-top";

  return (
    <div className="fixed inset-0 z-[200]" aria-modal="true" role="dialog" aria-label="Flows page tour">
      {/* 4-panel overlay with cutout */}
      {rect ? (
        <>
          <div className="fixed inset-x-0 top-0 bg-black/60" style={{ height: Math.max(0, rect.top) }} />
          <div className="fixed inset-x-0 bottom-0 bg-black/60" style={{ top: Math.max(0, rect.bottom) }} />
          <div className="fixed left-0 bg-black/60" style={{ top: rect.top, width: Math.max(0, rect.left), height: rect.height }} />
          <div className="fixed right-0 bg-black/60" style={{ top: rect.top, left: Math.max(0, rect.right), height: rect.height }} />
          <div
            className="fixed pointer-events-none"
            style={{
              top: rect.top - 3,
              left: rect.left - 3,
              width: rect.width + 6,
              height: rect.height + 6,
              borderRadius: 10,
              boxShadow: "0 0 0 2px rgba(255,255,255,0.55), 0 0 0 4px rgba(79,110,247,0.35)",
            }}
          />
        </>
      ) : (
        <div className="fixed inset-0 bg-black/60" />
      )}

      {/* Tooltip */}
      <div
        className={`fixed z-[201] transition-all duration-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
        style={{ width: TOOLTIP_W, ...tooltipStyle() }}
      >
        <div className="relative">
          {showArrow && pl === "right" && <div className="absolute top-8 -left-[5px] w-2.5 h-2.5 bg-white rotate-45" style={{ boxShadow: "-1px 1px 3px rgba(0,0,0,0.08)" }} />}
          {showArrow && pl === "left"  && <div className="absolute top-8 -right-[5px] w-2.5 h-2.5 bg-white rotate-45" style={{ boxShadow: "1px -1px 3px rgba(0,0,0,0.08)" }} />}
          {showArrow && pl === "bottom" && <div className="absolute left-1/2 -translate-x-1/2 -top-[5px] w-2.5 h-2.5 bg-white rotate-45" style={{ boxShadow: "-1px -1px 3px rgba(0,0,0,0.08)" }} />}
          {showArrow && pl === "top"   && <div className="absolute left-1/2 -translate-x-1/2 -bottom-[5px] w-2.5 h-2.5 bg-white rotate-45" style={{ boxShadow: "1px 1px 3px rgba(0,0,0,0.08)" }} />}

          <div className="bg-white rounded-xl shadow-2xl p-5 relative">
            <button
              onClick={onClose}
              className="absolute top-3.5 right-3.5 text-gray-300 hover:text-gray-500 transition-colors cursor-pointer"
              aria-label="Close tour"
            >
              <X size={13} />
            </button>

            <h3 className="text-sm font-bold text-gray-900 mb-2 pr-5 leading-snug">{current.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4 whitespace-pre-line">{current.body}</p>

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={onClose}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer shrink-0"
              >
                Skip tour
              </button>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1">
                  {STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-full transition-all duration-200 ${
                        i === step ? "w-4 h-1.5 bg-[#4f6ef7]" : i < step ? "w-1.5 h-1.5 bg-[#4f6ef7]/40" : "w-1.5 h-1.5 bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={next}
                  className="text-xs font-semibold bg-[#4f6ef7] text-white px-3 py-1.5 rounded-lg hover:bg-[#3b5af5] transition-colors cursor-pointer shrink-0"
                >
                  {current.cta}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
