"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function PasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const mismatch = confirm.length > 0 && next !== confirm;
  const tooShort = next.length > 0 && next.length < 8;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (next !== confirm) { setError("Passwords don't match."); return; }
    if (next.length < 8) { setError("Password must be at least 8 characters."); return; }

    setLoading(true);
    setError("");

    const supabase = createClient();

    // Re-authenticate with current password first
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) { setError("Session expired — please sign in again."); setLoading(false); return; }

    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: current,
    });
    if (signInErr) { setError("Current password is incorrect."); setLoading(false); return; }

    const { error: updateErr } = await supabase.auth.updateUser({ password: next });
    if (updateErr) { setError(updateErr.message); setLoading(false); return; }

    setSuccess(true);
    setCurrent(""); setNext(""); setConfirm("");
    setLoading(false);
    setTimeout(() => setSuccess(false), 4000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Current password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Current password
        </label>
        <div className="relative">
          <input
            type={showCurrent ? "text" : "password"}
            required
            value={current}
            onChange={(e) => { setCurrent(e.target.value); setError(""); }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            placeholder="••••••••"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            aria-label={showCurrent ? "Hide password" : "Show password"}
          >
            {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {/* New password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          New password
        </label>
        <div className="relative">
          <input
            type={showNext ? "text" : "password"}
            required
            minLength={8}
            value={next}
            onChange={(e) => { setNext(e.target.value); setError(""); }}
            className={`w-full border rounded-lg px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:border-transparent ${
              tooShort
                ? "border-red-300 focus:ring-red-400"
                : "border-gray-300 focus:ring-brand-500"
            }`}
            placeholder="At least 8 characters"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowNext(!showNext)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            aria-label={showNext ? "Hide password" : "Show password"}
          >
            {showNext ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {tooShort && (
          <p className="mt-1 text-xs text-red-500">Must be at least 8 characters</p>
        )}
      </div>

      {/* Confirm password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm new password
        </label>
        <input
          type="password"
          required
          value={confirm}
          onChange={(e) => { setConfirm(e.target.value); setError(""); }}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent ${
            mismatch
              ? "border-red-300 focus:ring-red-400"
              : "border-gray-300 focus:ring-brand-500"
          }`}
          placeholder="Repeat new password"
          autoComplete="new-password"
        />
        {mismatch && (
          <p className="mt-1 text-xs text-red-500">Passwords don&apos;t match</p>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Success */}
      {success && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
          <CheckCircle2 size={15} className="shrink-0" />
          Password updated successfully
        </div>
      )}

      <button
        type="submit"
        disabled={loading || mismatch || tooShort}
        className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        {loading ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
