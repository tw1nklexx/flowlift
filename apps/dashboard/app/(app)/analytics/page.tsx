import { createClient } from "@/lib/supabase/server";
import type { Flow, FlowEvent, FlowAnalytics } from "@/types";
import AnalyticsChart from "./AnalyticsChart";

export default async function AnalyticsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("user_id", user!.id)
    .single();

  if (!project) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-400">Set up your project to view analytics.</p>
      </div>
    );
  }

  const { data: flows } = await supabase
    .from("flows")
    .select("id, name")
    .eq("project_id", project.id);

  const { data: events } = await supabase
    .from("flow_events")
    .select("flow_id, session_id, event_type")
    .eq("project_id", project.id);

  const analytics: FlowAnalytics[] = (flows ?? []).map((flow: Pick<Flow, "id" | "name">) => {
    const flowEvents = (events as FlowEvent[] ?? []).filter((e) => e.flow_id === flow.id);
    const shownSessions = new Set(
      flowEvents.filter((e) => e.event_type === "flow_shown").map((e) => e.session_id),
    );
    const completedSessions = new Set(
      flowEvents.filter((e) => e.event_type === "flow_completed").map((e) => e.session_id),
    );
    const shown = shownSessions.size;
    const completed = completedSessions.size;
    return {
      flow_id: flow.id,
      flow_name: flow.name,
      shown,
      completed,
      completion_rate: shown > 0 ? Math.round((completed / shown) * 100) : 0,
    };
  });

  const totalShown = analytics.reduce((s, a) => s + a.shown, 0);
  const totalCompleted = analytics.reduce((s, a) => s + a.completed, 0);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Analytics</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Total impressions" value={totalShown} />
        <StatCard label="Total completions" value={totalCompleted} />
        <StatCard
          label="Overall completion rate"
          value={`${totalShown > 0 ? Math.round((totalCompleted / totalShown) * 100) : 0}%`}
        />
      </div>

      {analytics.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <p className="text-4xl mb-4">📊</p>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No data yet</h2>
          <p className="text-sm text-gray-500">Events will appear here once users see your flows.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-6">Completion rate by flow</h2>
          <AnalyticsChart data={analytics} />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
