"use client";
import Link from "next/link";
import { Headphones, TrendingUp, Settings, Plus } from "lucide-react";

const employees = [
  { name: "Support Agent", role: "Customer Support", status: "active", conversations: 847, icon: Headphones },
  { name: "Sales Dev Rep", role: "SDR", status: "active", conversations: 312, icon: TrendingUp },
  { name: "Ops Bot", role: "Ops Coordinator", status: "paused", conversations: 88, icon: Settings },
];

export function EmployeeStatusGrid() {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">AI Employees</h3>
        <Link href="/dashboard/employees/new" className="text-[#6366F1] text-xs hover:text-[#3B82F6] transition-colors">
          + Hire
        </Link>
      </div>
      <div className="space-y-3">
        {employees.map((emp) => (
          <Link
            key={emp.name}
            href={`/dashboard/employees`}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/3 transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#6366F1]/15 flex items-center justify-center flex-shrink-0">
              <emp.icon className="w-4 h-4 text-[#6366F1]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{emp.name}</p>
              <p className="text-[#94A3B8] text-xs">{emp.conversations} convs</p>
            </div>
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${emp.status === "active" ? "bg-[#10B981]" : "bg-[#94A3B8]"}`} />
          </Link>
        ))}
        <Link
          href="/dashboard/employees/new"
          className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-white/10 hover:border-white/20 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg border border-dashed border-white/15 flex items-center justify-center">
            <Plus className="w-4 h-4 text-[#94A3B8]" />
          </div>
          <span className="text-[#94A3B8] text-sm">Hire new employee</span>
        </Link>
      </div>
    </div>
  );
}
