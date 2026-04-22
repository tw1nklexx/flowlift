"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { FlowAnalytics } from "@/types";

export default function AnalyticsChart({ data }: { data: FlowAnalytics[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis
          dataKey="flow_name"
          tick={{ fontSize: 12, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 12, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          formatter={(value: number) => [`${value}%`, "Completion rate"]}
          contentStyle={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        />
        <Bar dataKey="completion_rate" radius={[6, 6, 0, 0]}>
          {data.map((entry, idx) => (
            <Cell
              key={idx}
              fill={entry.completion_rate >= 50 ? "#4f6ef7" : "#a5b4fc"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
