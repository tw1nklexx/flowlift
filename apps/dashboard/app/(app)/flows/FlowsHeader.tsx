"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, HelpCircle } from "lucide-react";
import AIGeneratorModal from "@/components/AIGeneratorModal";
import { FlowsPageTour } from "@/components/FlowsPageTour";

interface Props {
  projectId: string;
}

export default function FlowsHeader({ projectId }: Props) {
  const [showAI, setShowAI] = useState(false);
  const [showTour, setShowTour] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Flows</h1>
          <p className="text-sm text-gray-500 mt-1">
            Increase activation and reduce day-1 churn
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTour(true)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
            title="How flows work"
            aria-label="How flows work"
          >
            <HelpCircle size={15} />
          </button>
          <Link
            href="/flows/new"
            className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
          >
            + New Flow
          </Link>
          <button
            data-tour="ai-btn"
            onClick={() => setShowAI(true)}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Sparkles size={14} aria-hidden="true" />Generate with AI
          </button>
        </div>
      </div>

      {showAI && (
        <AIGeneratorModal projectId={projectId} onClose={() => setShowAI(false)} />
      )}
      {showTour && <FlowsPageTour onClose={() => setShowTour(false)} />}
    </>
  );
}
