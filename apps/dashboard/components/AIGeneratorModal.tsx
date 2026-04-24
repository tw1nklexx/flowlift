"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const EXAMPLE_CHIPS = [
  "Welcome new users and guide them to create their first project",
  "Announce a new feature to existing users on the dashboard",
  "Prompt free users to upgrade when they hit a usage limit",
];

interface Props {
  projectId: string;
  onClose: () => void;
}

export default function AIGeneratorModal({ projectId, onClose }: Props) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/generate-flow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), projectId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      router.push(`/flows/${data.flowId}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">✨ Generate with AI</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Describe your goal — AI will build the flow for you
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none ml-4 mt-0.5"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Example chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {EXAMPLE_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => setPrompt(chip)}
              className="text-xs bg-purple-50 text-purple-700 border border-purple-200 rounded-full px-3 py-1 hover:bg-purple-100 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Welcome new users and guide them to create their first project"
          rows={4}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
        />

        {/* Error */}
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="mt-4 w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating…
            </>
          ) : (
            "✨ Generate Flow"
          )}
        </button>
      </div>
    </div>
  );
}
