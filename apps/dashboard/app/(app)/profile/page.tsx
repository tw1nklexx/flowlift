import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/types";
import { User, CreditCard, KeyRound, Shield } from "lucide-react";
import PasswordForm from "./PasswordForm";
import BillingSection from "../settings/BillingSection";
import DeleteAccountButton from "./DeleteAccountButton";

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .single<Project>();

  const joinedDate = new Date(user.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const plan = project?.plan ?? "free";
  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Profile</h1>
      <p className="text-sm text-gray-400 mb-8">Manage your account, password, and billing.</p>

      {/* ── Account Info ──────────────────────────────────────── */}
      <Section
        icon={<User size={16} />}
        title="Account"
        description="Your account details"
      >
        <dl className="space-y-3">
          <Row label="Email" value={user.email ?? "—"} />
          <Row label="Member since" value={joinedDate} />
          <Row
            label="Plan"
            value={
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                plan === "free"
                  ? "bg-gray-100 text-gray-600"
                  : plan === "starter"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-purple-100 text-purple-700"
              }`}>
                {planLabel}
              </span>
            }
          />
        </dl>
      </Section>

      {/* ── Password ──────────────────────────────────────────── */}
      <Section
        icon={<KeyRound size={16} />}
        title="Change password"
        description="Use a strong, unique password"
      >
        <PasswordForm />
      </Section>

      {/* ── Billing ───────────────────────────────────────────── */}
      <Section
        icon={<CreditCard size={16} />}
        title="Billing"
        description="Manage your subscription"
      >
        <BillingSection plan={plan} />
      </Section>

      {/* ── Danger Zone ───────────────────────────────────────── */}
      <Section
        icon={<Shield size={16} />}
        title="Danger zone"
        description="Irreversible account actions"
        danger
      >
        <p className="text-sm text-gray-500 mb-4">
          Deleting your account will permanently remove all your flows, analytics, and settings.
          This action cannot be undone.
        </p>
        <DeleteAccountButton />
      </Section>
    </div>
  );
}

/* ─── Sub-components ──────────────────────────────────────────────────── */

function Section({
  icon,
  title,
  description,
  children,
  danger = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-6 mb-5">
      <div className="flex items-start gap-3 mb-5">
        <span className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${
          danger ? "bg-red-50 text-red-500" : "bg-brand-50 text-brand-600"
        }`}>
          {icon}
        </span>
        <div>
          <h2 className={`text-sm font-semibold mb-0.5 ${danger ? "text-red-700" : "text-gray-900"}`}>
            {title}
          </h2>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="text-sm font-medium text-gray-900">{value}</dd>
    </div>
  );
}
