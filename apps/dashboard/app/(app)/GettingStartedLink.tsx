"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function GettingStartedLink() {
  const [done, setDone] = useState(true); // default true to avoid flash of green dot on load

  useEffect(() => {
    try {
      const saved = localStorage.getItem("fl_onboarding");
      const { step2Done } = saved ? JSON.parse(saved) : {};
      setDone(!!step2Done);
    } catch {
      setDone(false);
    }
  }, []);

  return (
    <Link
      href="/welcome"
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
    >
      <span className="text-base">🚀</span>
      Getting started
      {!done && (
        <span className="ml-auto w-2 h-2 rounded-full bg-green-400 shrink-0 animate-pulse" />
      )}
    </Link>
  );
}
