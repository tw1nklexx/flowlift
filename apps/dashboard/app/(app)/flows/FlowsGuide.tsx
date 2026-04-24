"use client";

import { useState, useEffect } from "react";

export default function FlowsGuide() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("fl_guided_done")) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem("fl_guided_done", "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <>
      <style>{`
        #first-template {
          box-shadow: 0 0 0 2px #4f6ef7, 0 0 0 5px rgba(79,110,247,0.18);
        }
        @keyframes fl-tip-arrow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }
      `}</style>
      <div className="mb-4 flex items-center justify-between gap-3 bg-[#4f6ef7] text-white rounded-xl px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="text-base select-none">👆</span>
          <p className="text-sm font-medium leading-snug">
            Start here — click to create a welcome flow in one click
          </p>
        </div>
        <button
          onClick={dismiss}
          className="shrink-0 text-white/70 hover:text-white text-lg leading-none transition-colors"
          aria-label="Dismiss guide"
        >
          ✕
        </button>
      </div>
    </>
  );
}
