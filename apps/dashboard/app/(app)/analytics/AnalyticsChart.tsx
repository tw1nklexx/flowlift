"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface FlowStat {
  flow_name: string;
  impressions: number;
  completions: number;
  completion_rate: number;
}

export default function AnalyticsChart({ data }: { data: FlowStat[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis
          dataKey="flow_name"
          tick={{ fontSize: 12, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 12, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          formatter={(value: number, name: string) => [
            value,
            name === "impressions" ? "Impressions" : "Completions",
          ]}
        />
        <Legend
          formatter={(value) =>
            value === "impressions" ? "Impressions" : "Completions"
          }
          wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
        />
        <Bar dataKey="impressions" fill="#4f6ef7" radius={[4, 4, 0, 0]} />
        <Bar dataKey="completions" fill="#22c55e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
