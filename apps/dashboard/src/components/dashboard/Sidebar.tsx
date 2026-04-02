"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, MessageSquare, BookOpen,
  BarChart3, Plug, CreditCard, Settings,
} from "lucide-react";
import { clsx } from "clsx";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Employees", href: "/dashboard/employees", icon: Users },
  { label: "Conversations", href: "/dashboard/conversations", icon: MessageSquare },
  { label: "Knowledge", href: "/dashboard/knowledge", icon: BookOpen },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Channels", href: "/dashboard/channels", icon: Plug },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 flex-shrink-0 border-r border-white/5 flex flex-col py-5">
      {/* Logo */}
      <div className="px-5 mb-8 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#3B82F6] flex items-center justify-center">
          <span className="text-white font-bold text-sm">A</span>
        </div>
        <span className="font-semibold text-base tracking-tight">Aria</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150",
                active
                  ? "bg-[#6366F1]/15 text-white font-medium"
                  : "text-[#94A3B8] hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={clsx("w-4 h-4 flex-shrink-0", active ? "text-[#6366F1]" : "")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 mt-4">
        <div className="glass-card rounded-xl p-3">
          <p className="text-xs text-[#94A3B8] mb-1">Free plan</p>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#6366F1] to-[#3B82F6] rounded-full" style={{ width: "23%" }} />
          </div>
          <p className="text-xs text-[#94A3B8] mt-1.5">23 / 100 conversations</p>
          <Link
            href="/dashboard/billing"
            className="mt-2 block text-center text-xs text-[#6366F1] hover:text-[#3B82F6] font-medium transition-colors"
          >
            Upgrade plan
          </Link>
        </div>
      </div>
    </aside>
  );
}
