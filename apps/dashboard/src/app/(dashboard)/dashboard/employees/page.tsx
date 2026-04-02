import Link from "next/link";
import { Plus, Headphones, TrendingUp, Settings } from "lucide-react";

const roleIcons = {
  customer_support: Headphones,
  sdr: TrendingUp,
  ops_coordinator: Settings,
};

const roleLabels = {
  customer_support: "Customer Support",
  sdr: "SDR",
  ops_coordinator: "Ops Coordinator",
};

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Employees</h1>
          <p className="text-[#94A3B8] text-sm mt-1">Manage your AI workforce</p>
        </div>
        <Link
          href="/dashboard/employees/new"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#6366F1] to-[#3B82F6] text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Hire employee
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Link
          href="/dashboard/employees/new"
          className="glass-card rounded-2xl p-6 border-dashed hover:border-white/15 transition-colors flex flex-col items-center justify-center gap-3 text-center h-48"
        >
          <div className="w-12 h-12 rounded-xl border-2 border-dashed border-white/15 flex items-center justify-center">
            <Plus className="w-5 h-5 text-[#94A3B8]" />
          </div>
          <div>
            <p className="font-semibold text-sm">Hire a new employee</p>
            <p className="text-[#94A3B8] text-xs mt-1">Set up in 10 minutes</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
