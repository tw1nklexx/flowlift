"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const STORAGE_KEY = "nudgify_snippet_installed";

export function SnippetInstallStep() {
  const [installed, setInstalled] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    setInstalled(localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  function markInstalled() {
    localStorage.setItem(STORAGE_KEY, "true");
    setInstalled(true);
  }

  function unmark() {
    localStorage.removeItem(STORAGE_KEY);
    setInstalled(false);
  }

  // Loading — avoid layout shift
  if (installed === null) {
    return (
      <div className="flex items-start gap-4">
        <div className="mt-0.5 w-6 h-6 rounded-full bg-gray-100 shrink-0" />
        <div className="h-4 w-48 bg-gray-100 rounded mt-0.5" />
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4">
      <div
        className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
          installed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
        }`}
      >
        {installed ? "✓" : ""}
      </div>
      <div className="flex-1 min-w-0">
        {installed ? (
          <>
            <p className="text-sm font-medium text-gray-400 line-through">
              Install the snippet in your app
            </p>
            <p className="text-xs text-green-600 font-medium mt-0.5">
              Snippet installed ✓
            </p>
            <button
              onClick={unmark}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors mt-1 cursor-pointer"
            >
              Not installed yet? Unmark
            </button>
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-gray-900">
              Install the snippet in your app
            </p>
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
              Paste the snippet into your app&apos;s HTML so Nudgify can track events.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={markInstalled}
                className="inline-flex items-center gap-1.5 text-xs font-medium border border-gray-300 rounded-md px-2.5 py-1 text-gray-600 hover:border-brand-400 hover:text-brand-600 transition-colors cursor-pointer"
              >
                <span className="text-gray-400">☐</span> Mark as installed
              </button>
              <Link
                href="/settings"
                className="text-xs font-semibold text-[#4f6ef7] hover:underline"
              >
                Go to Settings →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
