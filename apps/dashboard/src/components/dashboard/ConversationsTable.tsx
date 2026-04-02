"use client";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

const conversations = [
  { id: "conv_1", user: "sarah@customer.com", preview: "My order hasn't arrived yet...", status: "resolved", channel: "Web", time: "2m ago", employee: "Support Agent" },
  { id: "conv_2", user: "U04XK2Y (Slack)", preview: "How do I upgrade my plan?", status: "resolved", channel: "Slack", time: "11m ago", employee: "Support Agent" },
  { id: "conv_3", user: "+1 555 0147", preview: "I need a refund for my last invoice", status: "escalated", channel: "WhatsApp", time: "24m ago", employee: "Support Agent" },
  { id: "conv_4", user: "james@enterprise.io", preview: "Can you send the Q3 report summary?", status: "resolved", channel: "Email", time: "1h ago", employee: "Ops Bot" },
  { id: "conv_5", user: "VP Sales at Brightwave", preview: "Outreach sequence step 2 sent", status: "open", channel: "SDR", time: "2h ago", employee: "Sales Dev Rep" },
];

const statusConfig = {
  resolved: { icon: CheckCircle2, color: "text-[#10B981]", label: "Resolved" },
  escalated: { icon: AlertCircle, color: "text-yellow-400", label: "Escalated" },
  open: { icon: Clock, color: "text-[#6366F1]", label: "Open" },
};

export function ConversationsTable() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-white/5">
        <h3 className="font-semibold text-sm">Recent conversations</h3>
        <a href="/dashboard/conversations" className="text-[#94A3B8] text-xs hover:text-white transition-colors">
          View all →
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {["User", "Preview", "Employee", "Channel", "Status", "Time"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs text-[#94A3B8] font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {conversations.map((conv) => {
              const s = statusConfig[conv.status as keyof typeof statusConfig];
              return (
                <tr key={conv.id} className="border-b border-white/5 hover:bg-white/2 transition-colors cursor-pointer">
                  <td className="px-5 py-3.5 font-medium text-white/80 whitespace-nowrap">{conv.user}</td>
                  <td className="px-5 py-3.5 text-[#94A3B8] max-w-[200px] truncate">{conv.preview}</td>
                  <td className="px-5 py-3.5 text-[#94A3B8] whitespace-nowrap">{conv.employee}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs bg-white/5 px-2 py-0.5 rounded-full text-[#94A3B8]">
                      {conv.channel}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${s.color}`}>
                      <s.icon className="w-3.5 h-3.5" />
                      {s.label}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[#94A3B8] whitespace-nowrap">{conv.time}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
