import { createClient } from "@/lib/supabase/server";
import AnalyticsChart from "./AnalyticsChart";

interface FlowStat {
  flow_id: string;
  flow_name: string;
  impressions: number;
  completions: number;
  completion_rate: number;
}

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

  // Parallel queries: total impression count, total completion count, flows list, all events
  const [
    { count: totalImpressions },
    { count: totalCompletions },
    { data: flows },
    { data: events },
  ] = await Promise.all([
    supabase
      .from("flow_events")
      .select("*", { count: "exact", head: true })
      .eq("project_id", project.id)
      .eq("event_type", "flow_shown"),
    supabase
      .from("flow_events")
      .select("*", { count: "exact", head: true })
      .eq("project_id", project.id)
      .eq("event_type", "flow_completed"),
    supabase
      .from("flows")
      .select("id, name")
      .eq("project_id", project.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("flow_events")
      .select("flow_id, event_type")
      .eq("project_id", project.id)
      .in("event_type", ["flow_shown", "flow_completed"]),
  ]);

  const impressions = totalImpressions ?? 0;
  const completions = totalCompletions ?? 0;
  const overallRate =
    impressions > 0
      ? Math.round((completions / impressions) * 1000) / 10
      : 0;

  // Build per-flow stats from the events array
  const stats: FlowStat[] = (flows ?? []).map((flow) => {
    const flowEvents = (events ?? []).filter((e) => e.flow_id === flow.id);
    const shown = flowEvents.filter((e) => e.event_type === "flow_shown").length;
    const completed = flowEvents.filter((e) => e.event_type === "flow_completed").length;
    return {
      flow_id: flow.id,
      flow_name: flow.name,
      impressions: shown,
      completions: completed,
      completion_rate: shown > 0 ? Math.round((completed / shown) * 1000) / 10 : 0,
    };
  });

  const hasData = impressions > 0;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Analytics</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Impressions" value={impressions} />
        <StatCard label="Completions" value={completions} />
        <StatCard label="Completion rate" value={`${overallRate}%`} />
      </div>

      {!hasData ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <p className="text-4xl mb-4">📊</p>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            No analytics data yet
          </h2>
          <p className="text-sm text-gray-500">
            Create and publish a flow to start tracking.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-6">
            Impressions vs completions by flow
          </h2>
          <AnalyticsChart data={stats} />
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
