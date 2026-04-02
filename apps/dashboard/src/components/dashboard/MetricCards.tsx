"use client";
import { TrendingUp, TrendingDown, MessageSquare, CheckCircle2, AlertCircle, Clock } from "lucide-react";

const metrics = [
  {
    label: "Total conversations",
    value: "1,247",
    delta: "+18%",
    trend: "up",
    icon: MessageSquare,
  },
  {
    label: "Resolution rate",
    value: "84%",
    delta: "+6%",
    trend: "up",
    icon: CheckCircle2,
  },
  {
    label: "Escalations",
    value: "47",
    delta: "-23%",
    trend: "down",
    icon: AlertCircle,
  },
  {
    label: "Avg response time",
    value: "1.4 min",
    delta: "-40%",
    trend: "down",
    icon: Clock,
  },
];

export function MetricCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <div key={m.label} className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#94A3B8] text-xs">{m.label}</p>
            <m.icon className="w-4 h-4 text-[#94A3B8]" />
          </div>
          <p className="text-3xl font-bold mb-1">{m.value}</p>
          <div className="flex items-center gap-1">
            {m.trend === "up" ? (
              <TrendingUp className="w-3 h-3 text-[#10B981]" />
            ) : (
              <TrendingDown className="w-3 h-3 text-[#10B981]" />
            )}
            <span className="text-[#10B981] text-xs font-medium">{m.delta} vs last month</span>
          </div>
        </div>
      ))}
    </div>
  );
}
