import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/types";
import ApiKeyDisplay from "./ApiKeyDisplay";
import BillingSection from "./BillingSection";
import InstallTabs from "./InstallTabs";

export default async function SettingsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user!.id)
    .single<Project>();

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>

      <section className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-1">API Key</h2>
        <p className="text-sm text-gray-500 mb-4">
          Use this key to initialize the FlowLift snippet.
        </p>
        {project ? (
          <ApiKeyDisplay apiKey={project.api_key} />
        ) : (
          <p className="text-sm text-red-500">Project not found — try refreshing the page.</p>
        )}
      </section>

      <section className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Installation</h2>
        <p className="text-sm text-gray-500 mb-4">
          Add this before the closing <code>&lt;/body&gt;</code> tag.
        </p>
        {project && (
          <InstallTabs apiKey={project.api_key} />
        )}
      </section>

      <section className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Billing</h2>
        <BillingSection plan={project?.plan ?? "free"} />
      </section>

      {(project?.plan ?? "free") === "free" && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500">
          ⚡ <span className="font-medium text-gray-700">Watermark:</span> The &quot;Powered by FlowLift&quot; badge appears on your flows.{" "}
          Upgrade to Starter to remove it.
        </div>
      )}
    </div>
  );
}

