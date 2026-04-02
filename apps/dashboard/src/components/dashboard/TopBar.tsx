"use client";
import { Bell, Plus } from "lucide-react";
import Link from "next/link";

export function TopBar() {
  return (
    <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 flex-shrink-0">
      <div />
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/employees/new"
          className="flex items-center gap-1.5 text-sm font-medium px-3.5 py-1.5 rounded-lg bg-[#6366F1]/15 text-[#6366F1] hover:bg-[#6366F1]/25 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Hire employee
        </Link>
        <button className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors">
          <Bell className="w-4 h-4 text-[#94A3B8]" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366F1] to-[#3B82F6] flex items-center justify-center text-white text-xs font-bold">
          U
        </div>
      </div>
    </header>
  );
}
