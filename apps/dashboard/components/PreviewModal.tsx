"use client";

import { useEffect, useCallback, useState } from "react";
import type { Step } from "@/types";

interface Props {
  steps: Step[];
  flowName: string;
  onClose: () => void;
}

// ── helpers ──────────────────────────────────────────────────────────────────

function hexToRgba(hex: string, opacity: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity / 100})`;
}

function makeShadow(intensity: number): string {
  return `0 ${intensity * 0.2}px ${intensity * 0.6}px rgba(0,0,0,${intensity / 250})`;
}

function animClass(anim?: Step["animation"]): string {
  if (!anim || anim === "none") return "";
  return `pr-anim-${anim}`;
}

// ── main component ────────────────────────────────────────────────────────────

export default function PreviewModal({ steps, flowName, onClose }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);

  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const total = steps.length;

  function goNext() { setCurrentIdx((i) => Math.min(i + 1, total - 1)); }
  function goPrev() { setCurrentIdx((i) => Math.max(i - 1, 0)); }
  function restart() { setCurrentIdx(0); }

  if (total === 0) {
    return (
      <div className="fixed inset-0 z-[10000] bg-black/80 flex items-center justify-center" onClick={close}>
        <div className="bg-white rounded-2xl p-8 text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <p className="text-gray-600 mb-4">No steps to preview. Add a step first.</p>
          <button onClick={close} className="text-sm text-[#4f6ef7] hover:underline">Close</button>
        </div>
      </div>
    );
  }

  const step = steps[currentIdx];

  return (
    <>
      <style>{`
        @keyframes pr-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pr-slide {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pr-bounce {
          0%   { opacity: 0; transform: scale(0.85); }
          70%  { transform: scale(1.04); }
          100% { opacity: 1; transform: scale(1); }
        }
        .pr-anim-fade   { animation: pr-fade   300ms ease forwards; }
        .pr-anim-slide  { animation: pr-slide  300ms ease forwards; }
        .pr-anim-bounce { animation: pr-bounce 400ms ease forwards; }
      `}</style>

      {/* outer overlay */}
      <div
        className="fixed inset-0 z-[10000] bg-black/75 flex flex-col items-center justify-center p-4 sm:p-8"
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      >
        {/* top bar */}
        <div className="w-full max-w-[920px] flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-white/40 uppercase tracking-widest">
              Preview
            </span>
            <span className="text-xs text-white/50 truncate max-w-[240px]">— {flowName}</span>
          </div>
          <button
            onClick={close}
            className="text-white/50 hover:text-white text-2xl leading-none transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
            aria-label="Close preview"
          >
            ×
          </button>
        </div>

        {/* fake browser window */}
        <div className="w-full max-w-[920px] rounded-xl overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.5)] border border-white/10">

          {/* browser chrome */}
          <div className="bg-[#dfe1e5] flex items-center gap-3 px-4 h-10 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57] border border-black/10" />
              <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-black/10" />
              <span className="w-3 h-3 rounded-full bg-[#28c840] border border-black/10" />
            </div>
            <div className="flex items-center gap-1.5 text-gray-400 text-sm select-none ml-1">
              <span className="text-xs">‹</span>
              <span className="text-xs">›</span>
              <span className="text-sm leading-none">↻</span>
            </div>
            <div className="flex-1 bg-white/90 rounded-md px-3 h-6 text-[11px] text-gray-400 font-mono flex items-center gap-1.5">
              <span className="text-[10px] text-gray-400">🔒</span>
              <span>yourapp.com/dashboard</span>
            </div>
          </div>

          {/* fake webpage */}
          <div className="relative bg-[#f1f5f9]" style={{ height: 460 }}>
            <FakeAppUI />
            {/* step key drives remount → CSS animation restarts */}
            <StepLayer key={currentIdx} step={step} onNext={goNext} onDismiss={restart} />
          </div>
        </div>

        {/* controls */}
        <div className="mt-4 flex items-center gap-1.5">
          <button
            onClick={restart}
            className="px-3 py-1.5 text-xs text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            ↺ Restart
          </button>
          <div className="w-px h-4 bg-white/20 mx-1" />
          <button
            onClick={goPrev}
            disabled={currentIdx === 0}
            className="px-3 py-1.5 text-sm text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            ← Prev
          </button>
          <span className="px-4 py-1.5 text-xs font-semibold text-white/70 bg-white/10 rounded-lg min-w-[90px] text-center tabular-nums">
            Step {currentIdx + 1} of {total}
          </span>
          <button
            onClick={goNext}
            disabled={currentIdx === total - 1}
            className="px-3 py-1.5 text-sm text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    </>
  );
}

// ── fake app backdrop ─────────────────────────────────────────────────────────

function FakeAppUI() {
  return (
    <div className="h-full flex flex-col select-none pointer-events-none">
      {/* app nav */}
      <div className="h-12 bg-[#1e293b] flex items-center px-5 gap-5 shrink-0">
        <div className="w-20 h-4 bg-white/25 rounded-md" />
        <div className="flex items-center gap-3 ml-2">
          {[72, 56, 64].map((w, i) => (
            <div key={i} className="h-3 bg-white/10 rounded-sm" style={{ width: w }} />
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-white/20" />
        </div>
      </div>

      {/* body row */}
      <div className="flex flex-1 overflow-hidden">
        {/* sidebar */}
        <div className="w-[176px] bg-white border-r border-gray-200 shrink-0 px-3 py-4 space-y-1">
          {[
            { w: "76%", active: true },
            { w: "60%" },
            { w: "68%" },
            { w: "52%" },
            { w: "64%" },
            { w: "70%" },
          ].map((item, i) => (
            <div
              key={i}
              className={`h-7 rounded-md flex items-center px-2 ${item.active ? "bg-blue-50" : ""}`}
            >
              <div
                className={`h-2.5 rounded-sm ${item.active ? "bg-blue-200" : "bg-gray-200"}`}
                style={{ width: item.w }}
              />
            </div>
          ))}
        </div>

        {/* main content */}
        <div className="flex-1 p-6 overflow-hidden">
          {/* page heading */}
          <div className="mb-5">
            <div className="w-44 h-5 bg-gray-300 rounded-md mb-2.5" />
            <div className="w-64 h-3 bg-gray-200 rounded-sm" />
          </div>

          {/* stat cards */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="w-14 h-3 bg-gray-200 rounded-sm mb-3" />
                <div className="w-20 h-6 bg-gray-100 rounded-md" />
              </div>
            ))}
          </div>

          {/* table mock */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="h-9 border-b border-gray-100 flex items-center px-4 gap-6 bg-gray-50">
              {[96, 72, 56, 80].map((w, i) => (
                <div key={i} className="h-2.5 bg-gray-200 rounded-sm" style={{ width: w }} />
              ))}
            </div>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-9 border-b border-gray-50 flex items-center px-4 gap-6">
                {[96, 72, 56, 80].map((w, j) => (
                  <div key={j} className="h-2 bg-gray-100 rounded-sm" style={{ width: w }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── step rendering ────────────────────────────────────────────────────────────

interface StepRenderProps {
  step: Step;
  onNext: () => void;
  onDismiss: () => void;
}

function StepLayer({ step, onNext, onDismiss }: StepRenderProps) {
  if (step.type === "modal")   return <ModalStep   step={step} onNext={onNext} onDismiss={onDismiss} />;
  if (step.type === "banner")  return <BannerStep  step={step} onNext={onNext} onDismiss={onDismiss} />;
  return <TooltipStep step={step} onNext={onNext} />;
}

function ModalStep({ step, onNext, onDismiss }: StepRenderProps) {
  const btnColor        = step.btnColor        ?? "#4f6ef7";
  const btnText         = step.btnTextColor    ?? "#ffffff";
  const btnRadius       = step.btnBorderRadius ?? 8;
  const titleColor      = step.titleColor      ?? "#111111";
  const titleSize       = step.titleFontSize   ?? 20;
  const bodySize        = step.bodyFontSize    ?? 15;
  const containerRadius = step.containerRadius ?? 16;
  const shadow          = makeShadow(step.shadowIntensity ?? 50);
  const overlayBg       = hexToRgba(step.overlayColor ?? "#000000", step.overlayOpacity ?? 45);
  const anim            = animClass(step.animation ?? "fade");

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: overlayBg }}
    >
      <div
        className={anim}
        style={{
          background: "#fff",
          borderRadius: containerRadius,
          padding: "32px",
          maxWidth: 440,
          width: "88%",
          boxShadow: shadow,
          position: "relative",
        }}
      >
        <button
          onClick={onDismiss}
          style={{
            position: "absolute", top: 12, right: 14,
            background: "none", border: "none", cursor: "pointer",
            color: "#aaa", fontSize: 18, lineHeight: 1,
          }}
        >
          ✕
        </button>
        {step.title && (
          <p style={{ fontSize: titleSize, fontWeight: 700, color: titleColor, margin: "0 0 10px 0" }}>
            {step.title}
          </p>
        )}
        <p style={{ fontSize: bodySize, color: "#555", lineHeight: 1.6, margin: "0 0 22px 0" }}>
          {step.body}
        </p>
        <button
          onClick={onNext}
          style={{
            backgroundColor: btnColor, color: btnText,
            borderRadius: btnRadius, padding: "10px 20px",
            border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}
        >
          {step.cta_label}
        </button>
      </div>
    </div>
  );
}

function BannerStep({ step, onNext, onDismiss }: StepRenderProps) {
  const bgColor   = step.bgColor        ?? "#4f6ef7";
  const bodySize  = step.bodyFontSize   ?? 14;
  const padding   = step.bannerPadding  ?? 12;
  const btnRadius = step.btnBorderRadius ?? 6;
  const anim      = animClass(step.animation ?? "slide");
  const pos       = step.position === "bottom" ? { bottom: 0 } : { top: 0 };

  return (
    <div
      className={`absolute left-0 right-0 flex items-center justify-between ${anim}`}
      style={{
        ...pos,
        backgroundColor: bgColor,
        padding: `${padding}px 20px`,
        zIndex: 20,
      }}
    >
      <span style={{ color: "#fff", fontSize: bodySize, flex: 1 }}>{step.body}</span>
      <button
        onClick={onNext}
        style={{
          background: "#fff", color: bgColor, border: "none",
          borderRadius: btnRadius, padding: "5px 14px",
          fontSize: 13, fontWeight: 600, cursor: "pointer", marginLeft: 16,
        }}
      >
        {step.cta_label}
      </button>
      <button
        onClick={onDismiss}
        style={{
          background: "none", border: "none",
          color: "rgba(255,255,255,0.7)", cursor: "pointer",
          fontSize: 18, marginLeft: 8,
        }}
      >
        ✕
      </button>
    </div>
  );
}

function TooltipStep({ step, onNext }: { step: Step; onNext: () => void }) {
  const btnColor        = step.btnColor        ?? "#4f6ef7";
  const btnText         = step.btnTextColor    ?? "#ffffff";
  const btnRadius       = step.btnBorderRadius ?? 8;
  const bodySize        = step.bodyFontSize    ?? 14;
  const containerRadius = step.containerRadius ?? 10;
  const shadow          = makeShadow(step.shadowIntensity ?? 50);
  const anim            = animClass(step.animation ?? "fade");
  const tooltipBg       = "#1a1a2e";

  return (
    <div
      className={`absolute ${anim}`}
      style={{
        bottom: 28, right: 28,
        backgroundColor: tooltipBg,
        borderRadius: containerRadius,
        padding: "14px 16px",
        maxWidth: 260,
        boxShadow: shadow,
        zIndex: 20,
      }}
    >
      <p style={{ color: "#e5e7eb", fontSize: bodySize, lineHeight: 1.5, margin: "0 0 12px 0" }}>
        {step.body}
      </p>
      <button
        onClick={onNext}
        style={{
          backgroundColor: btnColor, color: btnText,
          borderRadius: btnRadius, padding: "6px 14px",
          border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer",
        }}
      >
        {step.cta_label}
      </button>
      {/* arrow */}
      <div
        style={{
          position: "absolute", bottom: -5, left: 16,
          width: 10, height: 10,
          backgroundColor: tooltipBg,
          transform: "rotate(45deg)",
        }}
      />
    </div>
  );
}
