"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function FixWithAIButton({ flowId, stepIndex }: { flowId: string; stepIndex: number }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleClick() {
    setStatus("loading");
    try {
      const supabase = createClient();

      // 1. Fetch current flow steps
      const { data: flow, error } = await supabase
        .from("flows")
        .select("steps")
        .eq("id", flowId)
        .single();
      if (error || !flow) { setStatus("error"); return; }

      const steps = flow.steps as Record<string, unknown>[];
      const step = steps[stepIndex];
      if (!step) { setStatus("error"); return; }

      // 2. Call AI improve
      const res = await fetch("/api/ai/improve-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: step.type, title: step.title, body: step.body, cta_label: step.cta_label }),
      });
      if (!res.ok) { setStatus("error"); return; }
      const improved = await res.json();

      // 3. Update step in Supabase
      const newSteps = steps.map((s, i) => i === stepIndex ? { ...s, ...improved } : s);
      const { error: updateErr } = await supabase
        .from("flows")
        .update({ steps: newSteps })
        .eq("id", flowId);
      if (updateErr) { setStatus("error"); return; }

      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="mt-3 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
        <span className="font-medium">Step improved!</span>
        <Link href={`/flows/${flowId}`} className="underline underline-offset-2 hover:text-green-900 font-semibold">
          Review it in the builder →
        </Link>
      </div>
    );
  }

  if (status === "error") {
    return <p className="mt-3 text-xs text-red-500">Something went wrong — try again.</p>;
  }

  return (
    <button
      onClick={handleClick}
      disabled={status === "loading"}
      className="mt-3 inline-flex items-center gap-1.5 bg-white border border-purple-200 text-purple-600 hover:bg-purple-50 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
    >
      <Sparkles size={12} />
      {status === "loading" ? "Improving…" : "✨ Fix with AI"}
    </button>
  );
}
