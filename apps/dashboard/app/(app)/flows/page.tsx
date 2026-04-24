import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TEMPLATES } from "@/lib/templates";
import type { Flow, Project } from "@/types";
import FlowsGuide from "./FlowsGuide";

export default async function FlowsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("user_id", user!.id)
    .single<Project>();

  const { data: flows } = project
    ? await supabase
        .from("flows")
        .select("*")
        .eq("project_id", project.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  async function createFromTemplate(formData: FormData) {
    "use server";
    const templateId = formData.get("templateId") as string;
    const template = TEMPLATES.find((t) => t.id === templateId);
    if (!template || !project) return;

    const sb = createClient();
    const { data: flow, error } = await sb
      .from("flows")
      .insert({
        project_id: project.id,
        name: template.name,
        steps: template.steps,
        targeting_rules: template.targeting_rules,
        is_active: false,
      })
      .select("id")
      .single();

    if (!error && flow) redirect(`/flows/${flow.id}`);
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Flows</h1>
          <p className="text-sm text-gray-500 mt-1">
            Build guided experiences for your users
          </p>
        </div>
        <Link
          href="/flows/new"
          className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          + New Flow
        </Link>
      </div>

      {/* First-time hero card */}
      {(!flows || flows.length === 0) && (
        <div className="mb-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl px-8 py-10 text-center text-white">
          <p className="text-5xl mb-3 select-none">🚀</p>
          <h2 className="text-xl font-bold mb-2">Create your first onboarding flow</h2>
          <p className="text-sm text-blue-100 leading-relaxed max-w-sm mx-auto mb-5">
            Pick a template below and launch in 2 minutes. Your users will see it the moment they visit your app.
          </p>
          <span className="text-2xl animate-bounce inline-block" aria-hidden="true">↓</span>
        </div>
      )}

      {/* Templates */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Start from a template
        </h2>
        {(!flows || flows.length === 0) && <FlowsGuide />}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {TEMPLATES.map((template, idx) => (
            <div
              id={idx === 0 ? "first-template" : undefined}
              key={template.id}
              className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-5 flex flex-col"
            >
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                {template.name}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed flex-1 mb-4">
                {template.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-indigo-400 font-medium">
                  {template.stepCount} steps
                </span>
                <form action={createFromTemplate}>
                  <input type="hidden" name="templateId" value={template.id} />
                  <button
                    type="submit"
                    className="text-xs font-semibold text-[#4f6ef7] bg-white border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    Use template
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* My Flows */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          My flows
        </h2>

        {!flows || flows.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <p className="text-4xl mb-4">⚡</p>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No flows yet</h3>
            <p className="text-sm text-gray-500 mb-6">
              Pick a template above or start from scratch
            </p>
            <Link
              href="/flows/new"
              className="bg-brand-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
            >
              Create from scratch
            </Link>
          </div>
        ) : (
          <div className="grid gap-3">
            {(flows as Flow[]).map((flow) => (
              <Link
                key={flow.id}
                href={`/flows/${flow.id}`}
                className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between hover:border-brand-300 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{flow.name}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        flow.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {flow.is_active ? "Active" : "Draft"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {flow.steps.length} step{flow.steps.length !== 1 ? "s" : ""} ·{" "}
                    {new Date(flow.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-sm text-brand-600 font-medium">Edit →</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
