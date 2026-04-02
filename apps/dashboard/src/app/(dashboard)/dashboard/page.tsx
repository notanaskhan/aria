import { MetricCards } from "@/components/dashboard/MetricCards";
import { ConversationsTable } from "@/components/dashboard/ConversationsTable";
import { EmployeeStatusGrid } from "@/components/dashboard/EmployeeStatusGrid";
import { ActivityChart } from "@/components/dashboard/ActivityChart";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-[#94A3B8] text-sm mt-1">Your AI workforce at a glance</p>
      </div>
      <MetricCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ActivityChart />
        </div>
        <EmployeeStatusGrid />
      </div>
      <ConversationsTable />
    </div>
  );
}
