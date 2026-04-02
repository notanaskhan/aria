"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mar 3", conversations: 28 },
  { day: "Mar 7", conversations: 34 },
  { day: "Mar 11", conversations: 29 },
  { day: "Mar 15", conversations: 51 },
  { day: "Mar 19", conversations: 44 },
  { day: "Mar 23", conversations: 63 },
  { day: "Mar 27", conversations: 58 },
  { day: "Mar 31", conversations: 72 },
];

export function ActivityChart() {
  return (
    <div className="glass-card rounded-2xl p-5 h-64">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">Conversation volume</h3>
        <span className="text-[#94A3B8] text-xs">Last 30 days</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <defs>
            <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            tick={{ fill: "#94A3B8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#94A3B8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#111118",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "8px",
              color: "white",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="conversations"
            stroke="#6366F1"
            strokeWidth={2}
            fill="url(#colorConv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
