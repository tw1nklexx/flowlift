import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

interface FlowStat {
  id: string;
  name: string;
  is_active: boolean;
  shown: number;
  completed: number;
  rate: number;
}

export default async function StatsPage() {
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Stats</h1>
        <p className="text-gray-400">Set up your project to view stats.</p>
      </div>
    );
  }

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
      .select("id, name, is_active")
      .eq("project_id", project.id),
    supabase
      .from("flow_events")
      .select("flow_id, event_type")
      .eq("project_id", project.id)
      .in("event_type", ["flow_shown", "flow_completed"]),
  ]);

  const impressions = totalImpressions ?? 0;
  const completions = totalCompletions ?? 0;
  const overallRate =
    impressions > 0 ? Math.round((completions / impressions) * 1000) / 10 : 0;

  const stats: FlowStat[] = (flows ?? [])
    .map((flow) => {
      const fe = (events ?? []).filter((e) => e.flow_id === flow.id);
      const shown = fe.filter((e) => e.event_type === "flow_shown").length;
      const completed = fe.filter((e) => e.event_type === "flow_completed").length;
      return {
        id: flow.id,
        name: flow.name,
        is_active: flow.is_active,
        shown,
        completed,
        rate: shown > 0 ? Math.round((completed / shown) * 1000) / 10 : 0,
      };
    })
    .sort((a, b) => b.shown - a.shown);

  const hasData = impressions > 0;
  const hasActiveFlow = (flows ?? []).some((f) => f.is_active);

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Stats</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Total impressions" value={impressions} />
        <StatCard label="Completions" value={completions} />
        <StatCard label="Completion rate" value={`${overallRate}%`} />
      </div>

      {!hasData ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <p className="text-sm font-semibold text-gray-700 mb-6">
            Here&apos;s what you need to start seeing data:
          </p>
          <div className="space-y-4">
            <SetupStep done label="Account created" />
            <SetupStep
              done={hasActiveFlow}
              label={hasActiveFlow ? "Flow published" : "Publish a flow"}
              hint={!hasActiveFlow ? "You need at least one active flow for users to see." : undefined}
              href={!hasActiveFlow ? "/flows" : undefined}
              hrefLabel="Go to Flows →"
            />
            <SetupStep
              done={false}
              label="Install the snippet in your app"
              hint="Paste the snippet into your app's HTML so FlowLift can track events."
              href="/settings"
              hrefLabel="Go to Settings →"
            />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Flow
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Shown
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Completed
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Rate
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.map((s, i) => (
                <tr
                  key={s.id}
                  className={i < stats.length - 1 ? "border-b border-gray-50" : ""}
                >
                  <td className="px-5 py-3.5 font-medium text-gray-900">
                    <Link
                      href={`/flows/${s.id}`}
                      className="hover:text-[#4f6ef7] transition-colors"
                    >
                      {s.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-right text-gray-600 tabular-nums">
                    {s.shown}
                  </td>
                  <td className="px-5 py-3.5 text-right text-gray-600 tabular-nums">
                    {s.completed}
                  </td>
                  <td className="px-5 py-3.5 text-right text-gray-600 tabular-nums">
                    {s.shown > 0 ? `${s.rate}%` : "—"}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        s.is_active
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {s.is_active ? "Active" : "Draft"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

function SetupStep({
  done,
  label,
  hint,
  href,
  hrefLabel,
}: {
  done: boolean;
  label: string;
  hint?: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div
        className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
          done ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
        }`}
      >
        {done ? "✓" : ""}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${done ? "text-gray-400 line-through" : "text-gray-900"}`}>
          {label}
        </p>
        {hint && <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{hint}</p>}
        {href && hrefLabel && (
          <Link
            href={href}
            className="inline-flex items-center mt-1.5 text-xs font-semibold text-[#4f6ef7] hover:underline"
          >
            {hrefLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
