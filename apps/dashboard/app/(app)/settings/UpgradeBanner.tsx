"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export function UpgradeBanner() {
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (searchParams.get("upgraded") === "true") {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(t);
    }
  }, [searchParams]);

  if (!visible) return null;

  return (
    <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-sm font-medium">
      <span>🎉</span>
      <span>Welcome to Nudgify Pro! Your plan has been upgraded.</span>
      <button
        onClick={() => setVisible(false)}
        className="ml-auto text-green-600 hover:text-green-800 transition-colors"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
