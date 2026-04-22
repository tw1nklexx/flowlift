import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Flow, Project } from "@/types";

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

  return (
    <div className="p-8">
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

      {!flows || flows.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <p className="text-4xl mb-4">⚡</p>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No flows yet</h2>
          <p className="text-sm text-gray-500 mb-6">
            Create your first flow to start onboarding users
          </p>
          <Link
            href="/flows/new"
            className="bg-brand-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
          >
            Create your first flow
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {(flows as Flow[]).map((flow) => (
            <div
              key={flow.id}
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
              <Link
                href={`/flows/${flow.id}/edit`}
                className="text-sm text-brand-600 font-medium hover:underline"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
