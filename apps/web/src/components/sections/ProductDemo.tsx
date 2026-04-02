"use client";
import { motion } from "framer-motion";
import { BarChart3, CheckCircle2, AlertCircle } from "lucide-react";

export function ProductDemo() {
  return (
    <section className="py-24 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            A workforce you can{" "}
            <span className="gradient-text">actually manage</span>
          </h2>
          <p className="text-text-muted text-lg max-w-xl mx-auto">
            Every conversation logged, every escalation flagged, every metric tracked —
            so you always know what your AI employees are doing.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl overflow-hidden"
        >
          {/* Dashboard mock */}
          <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5">
            <div className="flex gap-1.5">
              {["#FF5F57", "#FFBD2E", "#28CA41"].map((c) => (
                <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
              ))}
            </div>
            <span className="text-text-muted text-xs ml-2">app.aria.ai — Dashboard</span>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div className="w-52 border-r border-white/5 p-4 hidden md:block">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 rounded-md bg-gradient-brand flex items-center justify-center">
                  <span className="text-white font-bold text-xs">A</span>
                </div>
                <span className="text-sm font-semibold">Aria</span>
              </div>
              {["Overview", "Employees", "Conversations", "Knowledge", "Channels", "Analytics", "Billing"].map((item, i) => (
                <div
                  key={item}
                  className={`px-3 py-2 rounded-lg text-xs mb-1 ${
                    i === 0 ? "bg-accent/15 text-accent" : "text-text-muted hover:text-white"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>

            {/* Main content */}
            <div className="flex-1 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-base">Overview</h3>
                <span className="text-text-muted text-xs">Last 30 days</span>
              </div>

              {/* Metric cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Conversations", value: "1,247", delta: "+18%", up: true },
                  { label: "Resolution rate", value: "84%", delta: "+6%", up: true },
                  { label: "Escalations", value: "47", delta: "-23%", up: false },
                  { label: "Avg response", value: "1.4m", delta: "-40%", up: false },
                ].map((m) => (
                  <div key={m.label} className="bg-background rounded-xl p-4 border border-white/5">
                    <p className="text-text-muted text-xs mb-1">{m.label}</p>
                    <p className="text-2xl font-bold mb-1">{m.value}</p>
                    <p className={`text-xs font-medium ${m.up ? "text-accent-emerald" : "text-accent-emerald"}`}>
                      {m.delta} vs last month
                    </p>
                  </div>
                ))}
              </div>

              {/* Recent conversations */}
              <div>
                <p className="text-text-muted text-xs uppercase tracking-wider mb-3">Recent conversations</p>
                <div className="space-y-2">
                  {[
                    { user: "sarah@customer.com", preview: "My order hasn't arrived yet...", status: "resolved", channel: "web", time: "2m ago" },
                    { user: "U04XK2Y (Slack)", preview: "How do I upgrade my plan?", status: "resolved", channel: "slack", time: "11m ago" },
                    { user: "+1 555 0147", preview: "I need a refund for my last invoice", status: "escalated", channel: "whatsapp", time: "24m ago" },
                    { user: "james@enterprise.io", preview: "Can you send the Q3 report summary?", status: "resolved", channel: "email", time: "1h ago" },
                  ].map((conv) => (
                    <div key={conv.user} className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
                      <div className="w-6 h-6 rounded-full bg-white/8 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white/50 text-xs">{conv.user[0].toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white/80 truncate">{conv.user}</p>
                        <p className="text-text-muted text-xs truncate">{conv.preview}</p>
                      </div>
                      <span className="text-text-muted text-xs hidden md:block">{conv.channel}</span>
                      <div className={`flex items-center gap-1 text-xs font-medium ${conv.status === "resolved" ? "text-accent-emerald" : "text-yellow-400"}`}>
                        {conv.status === "resolved"
                          ? <CheckCircle2 className="w-3 h-3" />
                          : <AlertCircle className="w-3 h-3" />}
                        {conv.status}
                      </div>
                      <span className="text-text-muted text-xs">{conv.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
