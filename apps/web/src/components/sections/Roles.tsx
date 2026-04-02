"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Headphones, TrendingUp, Settings } from "lucide-react";

const roles = [
  {
    id: "support",
    icon: Headphones,
    label: "Customer Support",
    tagline: "Resolves 80% of tickets without a human",
    description:
      "Handles inbound questions 24/7, looks up order status, troubleshoots issues, and escalates complex cases to your team — all in your brand's voice.",
    capabilities: [
      "Answers questions from your knowledge base",
      "Tracks escalation and resolution rates",
      "Multi-channel: web, Slack, WhatsApp, email",
      "Human handoff with full context",
    ],
    preview: {
      user: "My subscription renewal failed but I was charged. Can you help?",
      aria: "I can see the charge on your account from today. It looks like your payment method updated after the renewal trigger — I've already initiated a refund. You'll see it in 3–5 business days. Would you like me to retry the renewal with your new card?",
    },
  },
  {
    id: "sdr",
    icon: TrendingUp,
    label: "Sales Development Rep",
    tagline: "Researches leads and books meetings while you sleep",
    description:
      "Identifies prospects, researches accounts, writes personalized outreach, manages follow-up sequences, and books discovery calls — automatically.",
    capabilities: [
      "Prospect research and lead qualification",
      "Personalized outreach sequences",
      "Follow-up automation",
      "CRM sync (HubSpot, Salesforce)",
    ],
    preview: {
      user: "Write me an outreach email for a VP of Customer Success at a 200-person SaaS company.",
      aria: "Subject: Turning your support team into a superteam\n\nHi [Name], saw Brightwave just crossed 500 customers — congrats! At that stage, support ticket volume usually becomes the bottleneck nobody planned for. We help CS teams like yours handle 80% of inbound with AI, without losing the human touch. Open to a 15-min call this week?",
    },
  },
  {
    id: "ops",
    icon: Settings,
    label: "Ops Coordinator",
    tagline: "Handles scheduling, data entry, and reporting",
    description:
      "Takes care of the operational tasks that slow your team down — scheduling, internal request routing, data entry, status updates, and weekly reports.",
    capabilities: [
      "Scheduling and calendar management",
      "Internal request triage",
      "Automated status reports",
      "Connects to your existing tools",
    ],
    preview: {
      user: "Send the weekly ops report to the leadership team.",
      aria: "Done. I've compiled this week's ops report: 142 support tickets resolved (↑12%), 3 escalations, avg response time 1.8 min. Pipeline has 24 new leads from outreach. Report sent to leadership@company.com. Want me to schedule next week's send for Friday at 4pm?",
    },
  },
];

export function Roles() {
  const [active, setActive] = useState(0);
  const role = roles[active];

  return (
    <section id="roles" className="py-24 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Three AI employees,{" "}
            <span className="gradient-text">one platform</span>
          </h2>
          <p className="text-text-muted text-lg max-w-xl mx-auto">
            Pre-built roles that get to work immediately. Each with its own
            skills, persona, and channel setup.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tab selector */}
          <div className="flex lg:flex-col gap-3 lg:w-64 flex-shrink-0">
            {roles.map((r, i) => (
              <button
                key={r.id}
                onClick={() => setActive(i)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  active === i
                    ? "bg-accent/15 border border-accent/30 text-white"
                    : "border border-transparent text-text-muted hover:text-white hover:bg-white/5"
                }`}
              >
                <r.icon className={`w-4 h-4 flex-shrink-0 ${active === i ? "text-accent" : ""}`} />
                <span className="font-medium text-sm">{r.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 glass-card rounded-2xl p-6 md:p-8">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center flex-shrink-0">
                  <role.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">{role.label}</h3>
                  <p className="text-accent text-sm font-medium">{role.tagline}</p>
                </div>
              </div>

              <p className="text-text-muted mb-6 leading-relaxed">{role.description}</p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-3">Capabilities</p>
                  <ul className="space-y-2">
                    {role.capabilities.map((c) => (
                      <li key={c} className="flex items-start gap-2 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald mt-1.5 flex-shrink-0" />
                        <span className="text-white/80">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-background rounded-xl p-4 space-y-3 text-xs">
                  <p className="text-text-muted uppercase tracking-wider text-xs mb-2">Example</p>
                  <div className="bg-white/5 rounded-lg p-2.5 text-white/70">{role.preview.user}</div>
                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-2.5 text-white/85 whitespace-pre-line">
                    {role.preview.aria}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
