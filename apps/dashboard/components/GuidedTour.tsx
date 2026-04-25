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
    title: "Welcome to the Flow Builder 👋",
    body: "This is where you create onboarding experiences for your users. Let us show you around — it takes 30 seconds.",
    cta: "Show me →",
  },
  {
    target: "steps",
    placement: "right",
    title: "Your flow steps",
    body: "Each step is one screen your user sees. Add modals for important messages, tooltips to highlight specific buttons, or banners for announcements.",
    cta: "Got it →",
  },
  {
    target: "preview",
    placement: "inner-top",
    title: "Live preview",
    body: "See exactly what your users will see — updates instantly as you make changes. No guessing.",
    cta: "Nice →",
  },
  {
    target: "tab-content",
    placement: "left",
    title: "Content tab",
    body: "Write your message here. Title, body text, button label. Keep it short — users read less than you think.",
    cta: "Got it →",
  },
  {
    target: "tab-design",
    placement: "left",
    title: "Design tab",
    body: "Match your brand colors, adjust fonts and border radius. Your users will see a native-feeling experience, not a generic widget.",
    cta: "Cool →",
  },
  {
    target: "tab-targeting",
    placement: "left",
    title: "Targeting tab",
    body: "Control who sees this flow and when:\n• URL contains /dashboard → show only on dashboard\n• User plan = free → show only to free users\n• User is idle → show when user seems stuck\n• Session count ≤ 1 → show only to new users",
    cta: "Got it →",
  },
  {
    target: "publish-btn",
    placement: "bottom",
    title: "Publish when ready 🚀",
    body: "Hit Publish and your flow goes live instantly — no deployment, no code changes, no waiting for your developer. This is the whole point.",
    cta: "Let's build it!",
  },
];

export const TOUR_STORAGE_KEY = "nudgify_builder_tour_done";
const TOOLTIP_W = 292;
const GAP = 14;

export function GuidedTour({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [visible, setVisible] = useState(false);

  const current = STEPS[step];

  const updateRect = useCallback(() => {
    if (!current.target) {
      setRect(null);
      return;
    }
    const el = document.querySelector(`[data-tour="${current.target}"]`);
    setRect(el ? el.getBoundingClientRect() : null);
  }, [current.target]);

  useEffect(() => {
    updateRect();
    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, [updateRect]);

  // Fade in on each step change
  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, [step]);

  function finish() {
    localStorage.setItem(TOUR_STORAGE_KEY, "true");
    onClose();
  }

  function next() {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else finish();
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
    <div className="fixed inset-0 z-[200]" aria-modal="true" role="dialog" aria-label="Builder walkthrough">
      {/* Overlay: 4 panels cut out around highlighted element */}
      {rect ? (
        <>
          {/* Top */}
          <div
            className="fixed inset-x-0 top-0 bg-black/60"
            style={{ height: Math.max(0, rect.top) }}
          />
          {/* Bottom */}
          <div
            className="fixed inset-x-0 bottom-0 bg-black/60"
            style={{ top: Math.max(0, rect.bottom) }}
          />
          {/* Left */}
          <div
            className="fixed left-0 bg-black/60"
            style={{ top: rect.top, width: Math.max(0, rect.left), height: rect.height }}
          />
          {/* Right */}
          <div
            className="fixed right-0 bg-black/60"
            style={{ top: rect.top, left: Math.max(0, rect.right), height: rect.height }}
          />
          {/* Highlight ring around element */}
          <div
            className="fixed pointer-events-none"
            style={{
              top: rect.top - 3,
              left: rect.left - 3,
              width: rect.width + 6,
              height: rect.height + 6,
              borderRadius: 10,
              boxShadow:
                "0 0 0 2px rgba(255,255,255,0.55), 0 0 0 4px rgba(79,110,247,0.35)",
            }}
          />
        </>
      ) : (
        <div className="fixed inset-0 bg-black/60" />
      )}

      {/* Tooltip card */}
      <div
        className={`fixed z-[201] transition-all duration-200 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
        }`}
        style={{ width: TOOLTIP_W, ...tooltipStyle() }}
      >
        {/* Directional arrow */}
        <div className="relative">
          {showArrow && pl === "right" && (
            <div
              className="absolute top-8 -left-[5px] w-2.5 h-2.5 bg-white rotate-45"
              style={{ boxShadow: "-1px 1px 3px rgba(0,0,0,0.08)" }}
            />
          )}
          {showArrow && pl === "left" && (
            <div
              className="absolute top-8 -right-[5px] w-2.5 h-2.5 bg-white rotate-45"
              style={{ boxShadow: "1px -1px 3px rgba(0,0,0,0.08)" }}
            />
          )}
          {showArrow && pl === "bottom" && (
            <div
              className="absolute left-1/2 -translate-x-1/2 -top-[5px] w-2.5 h-2.5 bg-white rotate-45"
              style={{ boxShadow: "-1px -1px 3px rgba(0,0,0,0.08)" }}
            />
          )}
          {showArrow && pl === "top" && (
            <div
              className="absolute left-1/2 -translate-x-1/2 -bottom-[5px] w-2.5 h-2.5 bg-white rotate-45"
              style={{ boxShadow: "1px 1px 3px rgba(0,0,0,0.08)" }}
            />
          )}

          {/* Card */}
          <div className="bg-white rounded-xl shadow-2xl p-5 relative">
            {/* Close (skip) */}
            <button
              onClick={finish}
              className="absolute top-3.5 right-3.5 text-gray-300 hover:text-gray-500 transition-colors cursor-pointer"
              aria-label="Skip tour"
            >
              <X size={13} />
            </button>

            <h3 className="text-sm font-bold text-gray-900 mb-2 pr-5 leading-snug">
              {current.title}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4 whitespace-pre-line">
              {current.body}
            </p>

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={finish}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer shrink-0"
              >
                Skip tour
              </button>

              <div className="flex items-center gap-2.5">
                {/* Progress pills */}
                <div className="flex items-center gap-1">
                  {STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-full transition-all duration-200 ${
                        i === step
                          ? "w-4 h-1.5 bg-[#4f6ef7]"
                          : i < step
                          ? "w-1.5 h-1.5 bg-[#4f6ef7]/40"
                          : "w-1.5 h-1.5 bg-gray-200"
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
