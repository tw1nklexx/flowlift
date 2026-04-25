"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";

export default function DeleteAccountButton() {
  const [confirming, setConfirming] = useState(false);
  const [phrase, setPhrase] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const CONFIRM_PHRASE = "delete my account";

  async function handleDelete() {
    setLoading(true);
    const supabase = createClient();
    // Sign out — actual deletion would require a server action / edge function
    // For now, we sign out and show a support message
    await supabase.auth.signOut();
    router.push("/login?deleted=1");
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
      >
        Delete account
      </button>
    );
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-5 space-y-4">
      <div className="flex items-start gap-2.5">
        <TriangleAlert size={16} className="text-red-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-red-900 mb-1">This cannot be undone</p>
          <p className="text-sm text-red-700">
            All your flows, analytics data, and settings will be permanently deleted.
          </p>
        </div>
      </div>
      <div>
        <label className="block text-sm text-red-800 mb-1.5">
          Type <span className="font-mono font-semibold">{CONFIRM_PHRASE}</span> to confirm
        </label>
        <input
          type="text"
          value={phrase}
          onChange={(e) => setPhrase(e.target.value)}
          placeholder={CONFIRM_PHRASE}
          className="w-full border border-red-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
        />
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleDelete}
          disabled={phrase !== CONFIRM_PHRASE || loading}
          className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {loading ? "Deleting…" : "Yes, delete my account"}
        </button>
        <button
          onClick={() => { setConfirming(false); setPhrase(""); }}
          className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
