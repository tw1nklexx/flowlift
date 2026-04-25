"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Lock, Eye, EyeOff, CheckCircle2, AlertCircle,
  UserCircle2, KeyRound, Bell, TriangleAlert, X,
  ChevronRight, Zap, Layers, BarChart2, CreditCard,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */

interface Toast { id: number; message: string; type: "success" | "error" }

interface Notifications { productUpdates: boolean; tips: boolean }

interface Props {
  email: string;
  plan: string;
  joinedDate: string;
  initialDisplayName: string;
  initialTimezone: string;
  initialNotifications: Notifications;
}

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */

function avatarGradient(email: string): string {
  let h = 0;
  for (let i = 0; i < email.length; i++) h = email.charCodeAt(i) + ((h << 5) - h);
  h = Math.abs(h);
  const hue = h % 360;
  return `linear-gradient(135deg, hsl(${hue},65%,58%) 0%, hsl(${(hue + 50) % 360},70%,44%) 100%)`;
}

function initials(email: string): string {
  return (email.split("@")[0]?.[0] ?? "U").toUpperCase();
}

function pwStrength(pw: string) {
  if (!pw) return null;
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: "Weak", pct: 33, bar: "bg-red-400", text: "text-red-500" };
  if (score <= 2) return { label: "Fair", pct: 66, bar: "bg-orange-400", text: "text-orange-500" };
  return { label: "Strong", pct: 100, bar: "bg-emerald-500", text: "text-emerald-600" };
}

const TIMEZONES = [
  { value: "", label: "Select timezone" },
  { value: "America/New_York",    label: "Eastern (UTC−5)" },
  { value: "America/Chicago",     label: "Central (UTC−6)" },
  { value: "America/Denver",      label: "Mountain (UTC−7)" },
  { value: "America/Los_Angeles", label: "Pacific (UTC−8)" },
  { value: "America/Anchorage",   label: "Alaska (UTC−9)" },
  { value: "America/Honolulu",    label: "Hawaii (UTC−10)" },
  { value: "Europe/London",       label: "London (UTC+0)" },
  { value: "Europe/Paris",        label: "Paris (UTC+1)" },
  { value: "Europe/Helsinki",     label: "Helsinki (UTC+2)" },
  { value: "Europe/Moscow",       label: "Moscow (UTC+3)" },
  { value: "Asia/Dubai",          label: "Dubai (UTC+4)" },
  { value: "Asia/Kolkata",        label: "India (UTC+5:30)" },
  { value: "Asia/Bangkok",        label: "Bangkok (UTC+7)" },
  { value: "Asia/Shanghai",       label: "China (UTC+8)" },
  { value: "Asia/Tokyo",          label: "Tokyo (UTC+9)" },
  { value: "Australia/Sydney",    label: "Sydney (UTC+10)" },
  { value: "Pacific/Auckland",    label: "Auckland (UTC+12)" },
];

/* ─────────────────────────────────────────────
   Shared UI atoms
───────────────────────────────────────────── */

function Toggle({
  id, checked, onChange, disabled,
}: { id: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${checked ? "bg-brand-500" : "bg-gray-200"}`}
    >
      <span
        className={`pointer-events-none mt-0.5 ml-0.5 inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function Card({
  id, title, icon, children, danger = false,
}: {
  id?: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <section
      id={id}
      className={`rounded-2xl p-6 border ${
        danger ? "border-red-200 bg-red-50/30" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-2.5 mb-5">
        <span className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 ${
          danger ? "bg-red-100 text-red-500" : "bg-brand-50 text-brand-600"
        }`}>
          {icon}
        </span>
        <h2 className={`text-sm font-semibold ${danger ? "text-red-800" : "text-gray-900"}`}>
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function InputField({
  label, id, type = "text", value, onChange, readOnly, placeholder,
  autoComplete, suffix, error, helper,
}: {
  label: string; id: string; type?: string; value: string;
  onChange?: (v: string) => void; readOnly?: boolean; placeholder?: string;
  autoComplete?: string; suffix?: React.ReactNode; error?: string; helper?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          readOnly={readOnly}
          onChange={e => onChange?.(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full border rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:border-transparent ${
            readOnly
              ? "bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200"
              : error
              ? "border-red-300 focus:ring-red-400"
              : "border-gray-300 focus:ring-brand-500"
          } ${suffix ? "pr-10" : ""}`}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {helper && !error && <p className="mt-1 text-xs text-gray-400">{helper}</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Toast system
───────────────────────────────────────────── */

function ToastList({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: number) => void }) {
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium animate-in slide-in-from-right-4 duration-300 ${
            t.type === "success"
              ? "bg-white border-emerald-200 text-emerald-800"
              : "bg-white border-red-200 text-red-800"
          }`}
        >
          {t.type === "success"
            ? <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
            : <AlertCircle size={15} className="text-red-500 shrink-0" />
          }
          {t.message}
          <button
            onClick={() => dismiss(t.id)}
            className="ml-1 text-gray-300 hover:text-gray-500 transition-colors cursor-pointer"
            aria-label="Dismiss"
          >
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const dismiss = useCallback((id: number) => setToasts(p => p.filter(t => t.id !== id)), []);
  const addToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => dismiss(id), 3500);
  }, [dismiss]);
  return { toasts, dismiss, addToast };
}

/* ─────────────────────────────────────────────
   Delete modal
───────────────────────────────────────────── */

function DeleteModal({ onClose }: { onClose: () => void }) {
  const [phrase, setPhrase] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const PHRASE = "delete my account";

  async function handleDelete() {
    setLoading(true);
    const sb = createClient();
    await sb.auth.signOut();
    router.push("/?deleted=1");
  }

  // Close on Escape
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  const whatGets = [
    { icon: <Zap size={14} />, label: "All your flows and their settings" },
    { icon: <BarChart2 size={14} />, label: "Analytics and completion data" },
    { icon: <Layers size={14} />, label: "Targeting rules and templates" },
    { icon: <CreditCard size={14} />, label: "Billing history and subscription" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-red-100 shrink-0">
              <TriangleAlert size={18} className="text-red-600" />
            </span>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Delete your account</h3>
              <p className="text-xs text-gray-400 mt-0.5">This action is permanent and cannot be reversed.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer mt-0.5">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* What gets deleted */}
          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-red-800 mb-3 uppercase tracking-wide">
              What will be permanently deleted
            </p>
            <ul className="space-y-2">
              {whatGets.map((item, i) => (
                <li key={i} className="flex items-center gap-2.5 text-xs text-red-700">
                  <span className="text-red-400">{item.icon}</span>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Confirmation input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Type{" "}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-gray-800">
                {PHRASE}
              </code>{" "}
              to confirm
            </label>
            <input
              type="text"
              value={phrase}
              onChange={e => setPhrase(e.target.value)}
              placeholder={PHRASE}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 pb-6">
          <button
            onClick={handleDelete}
            disabled={phrase !== PHRASE || loading}
            className="flex-1 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {loading ? "Deleting everything…" : "Delete everything"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Account section
───────────────────────────────────────────── */

function AccountSection({
  email, initialDisplayName, initialTimezone, onSuccess,
}: {
  email: string; initialDisplayName: string; initialTimezone: string;
  onSuccess: (msg: string, type?: Toast["type"]) => void;
}) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [timezone, setTimezone] = useState(initialTimezone);
  const [saving, setSaving] = useState(false);
  const dirty = displayName !== initialDisplayName || timezone !== initialTimezone;

  async function save() {
    setSaving(true);
    const sb = createClient();
    const { error } = await sb.auth.updateUser({
      data: { display_name: displayName, timezone },
    });
    setSaving(false);
    if (error) onSuccess(error.message, "error");
    else onSuccess("Account information saved");
  }

  return (
    <Card id="account" title="Account information" icon={<UserCircle2 size={15} />}>
      <div className="space-y-4">
        {/* Email — read-only */}
        <InputField
          id="email"
          label="Email address"
          value={email}
          readOnly
          suffix={<Lock size={14} className="text-gray-300" />}
          helper='To change your email, contact support'
        />

        {/* Display name */}
        <InputField
          id="displayName"
          label="Display name"
          value={displayName}
          onChange={setDisplayName}
          placeholder="Your name"
          autoComplete="name"
          helper="Shown in your account and notifications"
        />

        {/* Timezone */}
        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
            Timezone
          </label>
          <select
            id="timezone"
            value={timezone}
            onChange={e => setTimezone(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white cursor-pointer"
          >
            {TIMEZONES.map(tz => (
              <option key={tz.value} value={tz.value}>{tz.label}</option>
            ))}
          </select>
        </div>

        {/* Save */}
        <div className="pt-1">
          <button
            onClick={save}
            disabled={!dirty || saving}
            className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          {!dirty && (
            <span className="ml-3 text-xs text-gray-400">No changes</span>
          )}
        </div>
      </div>
    </Card>
  );
}

/* ─────────────────────────────────────────────
   Password section
───────────────────────────────────────────── */

function PasswordSection({ onSuccess }: { onSuccess: (msg: string, type?: Toast["type"]) => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const strength = pwStrength(next);
  const mismatch = confirm.length > 0 && next !== confirm;
  const tooShort = next.length > 0 && next.length < 8;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (next !== confirm) { setError("Passwords don't match."); return; }
    if (next.length < 8) { setError("Password must be at least 8 characters."); return; }

    setSaving(true);
    setError("");
    const sb = createClient();

    const { data: { user } } = await sb.auth.getUser();
    if (!user?.email) { setError("Session expired — sign in again."); setSaving(false); return; }

    const { error: authErr } = await sb.auth.signInWithPassword({ email: user.email, password: current });
    if (authErr) { setError("Current password is incorrect."); setSaving(false); return; }

    const { error: updateErr } = await sb.auth.updateUser({ password: next });
    if (updateErr) { setError(updateErr.message); setSaving(false); return; }

    setCurrent(""); setNext(""); setConfirm("");
    setSaving(false);
    onSuccess("Password updated successfully");
  }

  return (
    <Card id="password" title="Change password" icon={<KeyRound size={15} />}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current password */}
        <div>
          <label htmlFor="current-pw" className="block text-sm font-medium text-gray-700 mb-1">
            Current password
          </label>
          <div className="relative">
            <input
              id="current-pw"
              type={showCurrent ? "text" : "password"}
              required
              value={current}
              onChange={e => { setCurrent(e.target.value); setError(""); }}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
            <button type="button" onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
              aria-label={showCurrent ? "Hide" : "Show"}>
              {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* New password */}
        <div>
          <label htmlFor="new-pw" className="block text-sm font-medium text-gray-700 mb-1">
            New password
          </label>
          <div className="relative">
            <input
              id="new-pw"
              type={showNext ? "text" : "password"}
              required
              value={next}
              onChange={e => { setNext(e.target.value); setError(""); }}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              className={`w-full border rounded-lg px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:border-transparent ${
                tooShort ? "border-red-300 focus:ring-red-400" : "border-gray-300 focus:ring-brand-500"
              }`}
            />
            <button type="button" onClick={() => setShowNext(!showNext)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
              aria-label={showNext ? "Hide" : "Show"}>
              {showNext ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {/* Strength bar */}
          {strength && (
            <div className="mt-2 space-y-1">
              <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${strength.bar}`}
                  style={{ width: `${strength.pct}%` }}
                />
              </div>
              <p className={`text-xs font-medium ${strength.text}`}>{strength.label}</p>
            </div>
          )}
          {tooShort && <p className="mt-1 text-xs text-red-500">Must be at least 8 characters</p>}
        </div>

        {/* Confirm password */}
        <div>
          <label htmlFor="confirm-pw" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm new password
          </label>
          <input
            id="confirm-pw"
            type="password"
            required
            value={confirm}
            onChange={e => { setConfirm(e.target.value); setError(""); }}
            placeholder="Repeat new password"
            autoComplete="new-password"
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent ${
              mismatch ? "border-red-300 focus:ring-red-400" : "border-gray-300 focus:ring-brand-500"
            }`}
          />
          {mismatch && <p className="mt-1 text-xs text-red-500">Passwords don&apos;t match</p>}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            <AlertCircle size={14} className="shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={saving || mismatch || tooShort || !current || !next || !confirm}
          className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {saving ? "Updating…" : "Update password"}
        </button>
      </form>
    </Card>
  );
}

/* ─────────────────────────────────────────────
   Notifications section
───────────────────────────────────────────── */

function NotificationsSection({
  initialNotifications, onSuccess,
}: {
  initialNotifications: Notifications;
  onSuccess: (msg: string, type?: Toast["type"]) => void;
}) {
  const [prefs, setPrefs] = useState<Notifications>(initialNotifications);
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(prefs) !== JSON.stringify(initialNotifications);

  const items = [
    {
      key: "productUpdates" as const,
      label: "Product updates",
      description: "New features and improvements",
      disabled: false,
    },
    {
      key: "tips" as const,
      label: "Tips and tutorials",
      description: "Learn how to get more from FlowLift",
      disabled: false,
    },
    {
      key: null,
      label: "Billing alerts",
      description: "Payment confirmations and renewal reminders",
      disabled: true,
      alwaysOn: true,
    },
  ];

  async function save() {
    setSaving(true);
    const sb = createClient();
    const { error } = await sb.auth.updateUser({ data: { notifications: prefs } });
    setSaving(false);
    if (error) onSuccess(error.message, "error");
    else onSuccess("Notification preferences saved");
  }

  return (
    <Card id="notifications" title="Notifications" icon={<Bell size={15} />}>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <div>
              <p className={`text-sm font-medium ${item.disabled ? "text-gray-400" : "text-gray-900"}`}>
                {item.label}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
              {item.alwaysOn && (
                <p className="text-xs text-gray-300 mt-0.5 italic">Always on — required for account safety</p>
              )}
            </div>
            <Toggle
              id={`notif-${i}`}
              checked={item.alwaysOn ? true : (item.key ? prefs[item.key] : false)}
              disabled={item.disabled}
              onChange={v => {
                if (item.key) setPrefs(p => ({ ...p, [item.key!]: v }));
              }}
            />
          </div>
        ))}

        <div className="pt-1">
          <button
            onClick={save}
            disabled={!dirty || saving}
            className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {saving ? "Saving…" : "Save preferences"}
          </button>
          {!dirty && <span className="ml-3 text-xs text-gray-400">No changes</span>}
        </div>
      </div>
    </Card>
  );
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */

const NAV_ITEMS = [
  { href: "#account",       label: "Account",       icon: <UserCircle2 size={14} /> },
  { href: "#password",      label: "Password",      icon: <KeyRound size={14} /> },
  { href: "#notifications", label: "Notifications", icon: <Bell size={14} /> },
  { href: "#danger",        label: "Danger zone",   icon: <TriangleAlert size={14} />, danger: true },
];

export default function ProfileClient({
  email, plan, joinedDate,
  initialDisplayName, initialTimezone, initialNotifications,
}: Props) {
  const { toasts, dismiss, addToast } = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const planBadge = {
    free:    { label: "Free",    cls: "bg-gray-100 text-gray-600" },
    starter: { label: "Starter", cls: "bg-blue-100 text-blue-700" },
    pro:     { label: "Pro",     cls: "bg-purple-100 text-purple-700" },
  }[plan] ?? { label: plan, cls: "bg-gray-100 text-gray-600" };

  const grad = avatarGradient(email);
  const initial = initials(email);

  return (
    <>
      {/* Toasts */}
      <ToastList toasts={toasts} dismiss={dismiss} />

      {/* Delete modal */}
      {showDeleteModal && <DeleteModal onClose={() => setShowDeleteModal(false)} />}

      <div className="p-6 lg:p-8 max-w-[900px]">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6" aria-label="Breadcrumb">
          <Link href="/settings" className="hover:text-gray-600 transition-colors">Settings</Link>
          <ChevronRight size={12} className="text-gray-300" />
          <span className="text-gray-600 font-medium">Profile</span>
        </nav>

        {/* Layout */}
        <div className="flex flex-col md:flex-row gap-8">

          {/* ── Left sidebar ── */}
          <aside className="md:w-[200px] shrink-0">
            <div className="md:sticky md:top-8 space-y-5">
              {/* Avatar card */}
              <div className="flex flex-col items-center text-center bg-white border border-gray-200 rounded-2xl p-5">
                {/* Avatar circle */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-sm mb-3 select-none"
                  style={{ background: grad }}
                  aria-hidden="true"
                >
                  {initial}
                </div>

                {/* Email */}
                <p className="text-xs text-gray-600 font-medium break-all leading-tight mb-2">
                  {email}
                </p>

                {/* Plan badge */}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2 ${planBadge.cls}`}>
                  {planBadge.label}
                </span>

                {/* Member since */}
                <p className="text-xs text-gray-400">Member since {joinedDate}</p>
              </div>

              {/* Section nav */}
              <nav aria-label="Profile sections" className="hidden md:block">
                <ul className="space-y-0.5">
                  {NAV_ITEMS.map(item => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          item.danger
                            ? "text-red-400 hover:bg-red-50 hover:text-red-600"
                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                        }`}
                      >
                        <span>{item.icon}</span>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          {/* ── Right content ── */}
          <div className="flex-1 min-w-0 space-y-5">
            <AccountSection
              email={email}
              initialDisplayName={initialDisplayName}
              initialTimezone={initialTimezone}
              onSuccess={addToast}
            />

            <PasswordSection onSuccess={addToast} />

            <NotificationsSection
              initialNotifications={initialNotifications}
              onSuccess={addToast}
            />

            {/* Danger zone */}
            <Card id="danger" title="Danger zone" icon={<TriangleAlert size={15} />} danger>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                Permanently deletes your account, all flows, analytics, and billing data.
                This cannot be undone.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              >
                Delete account
              </button>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
