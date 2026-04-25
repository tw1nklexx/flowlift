import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { PartyPopper, Lightbulb } from "lucide-react";

const BENCHMARK = 38; // industry avg completion rate %

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
  const aboveBenchmark = hasData && overallRate >= BENCHMARK;

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Stats</h1>

      {/* ── Stat cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-5">

        {/* Card 1 — Impressions */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Impressions
          </p>
          <p className="text-3xl font-bold text-gray-900 tabular-nums leading-none">
            {impressions.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-2">times your flows were shown</p>
        </div>

        {/* Card 2 — Completion rate */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Completion rate
          </p>
          {hasData ? (
            <>
              <p className="text-3xl font-bold text-gray-900 tabular-nums leading-none mb-3">
                {overallRate}%
              </p>
              {/* Progress bar with benchmark marker */}
              <div className="relative h-1.5 bg-gray-100 rounded-full mb-2">
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: `${Math.min(overallRate, 100)}%`,
                    backgroundColor: aboveBenchmark ? "#22c55e" : "#f59e0b",
                  }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-px h-3 bg-gray-400"
                  style={{ left: `${BENCHMARK}%` }}
                />
              </div>
              <p className="text-[11px] text-gray-400 mb-1.5">Industry avg: {BENCHMARK}%</p>
              {aboveBenchmark ? (
                <span className="text-[11px] font-semibold text-green-600">Above average ↑</span>
              ) : (
                <span className="text-[11px] font-semibold text-amber-500">Room to improve →</span>
              )}
            </>
          ) : (
            <>
              <p className="text-3xl font-bold text-gray-300 leading-none mb-3">—</p>
              <p className="text-xs text-gray-400">Publish a flow to start tracking</p>
            </>
          )}
        </div>

        {/* Card 3 — Completions */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Completions
          </p>
          <p className="text-3xl font-bold text-gray-900 tabular-nums leading-none">
            {completions.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-2">users finished your onboarding</p>
        </div>
      </div>

      {/* ── Insight banner ────────────────────────────────────────── */}
      {hasData && (
        aboveBenchmark ? (
          <div className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-6">
            <PartyPopper size={16} className="shrink-0 mt-0.5 text-green-600" aria-hidden="true" />
            <p className="text-sm text-green-800 font-medium">
              Great work! Your completion rate is above industry average.
            </p>
          </div>
        ) : (
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6">
            <Lightbulb size={16} className="shrink-0 mt-0.5 text-blue-500" aria-hidden="true" />
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Tip:</span> Flows with 2–3 steps convert 40% better than longer ones.{" "}
              <Link href="/flows" className="font-semibold underline underline-offset-2 hover:text-blue-900">
                Check your flow lengths →
              </Link>
            </p>
          </div>
        )
      )}

      {/* ── Flow table / empty state ──────────────────────────────── */}
      {!hasData ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
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
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
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
                  className={`hover:bg-gray-50/50 transition-colors ${i < stats.length - 1 ? "border-b border-gray-50" : ""}`}
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
                  <td className="px-5 py-3.5">
                    {s.shown > 0 ? (
                      <div className="flex items-center justify-end gap-2.5">
                        <span className="tabular-nums text-gray-700 font-medium w-10 text-right text-xs">
                          {s.rate}%
                        </span>
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min(s.rate, 100)}%`,
                              backgroundColor: s.rate >= BENCHMARK ? "#22c55e" : "#f59e0b",
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2.5">
                        <span className="text-gray-300 w-10 text-right text-xs">—</span>
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full" />
                      </div>
                    )}
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
