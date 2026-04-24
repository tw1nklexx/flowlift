"use client";

import Link from "next/link";
import { useState } from "react";
import AIGeneratorModal from "@/components/AIGeneratorModal";

interface Props {
  projectId: string;
}

export default function FlowsHeader({ projectId }: Props) {
  const [showAI, setShowAI] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Flows</h1>
          <p className="text-sm text-gray-500 mt-1">
            Build guided experiences for your users
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAI(true)}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            ✨ Generate with AI
          </button>
          <Link
            href="/flows/new"
            className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
          >
            + New Flow
          </Link>
        </div>
      </div>

      {showAI && (
        <AIGeneratorModal projectId={projectId} onClose={() => setShowAI(false)} />
      )}
    </>
  );
}
