"use client";
import { motion } from "framer-motion";
import { Brain, ShieldCheck, Zap, Globe, Users, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Learns your business",
    description:
      "Upload your docs, FAQs, and URLs. Aria indexes everything and answers questions only from your knowledge — never makes things up.",
  },
  {
    icon: Globe,
    title: "Works where your customers are",
    description:
      "One AI employee, every channel. Slack, WhatsApp, email, and your website — all connected, all consistent.",
  },
  {
    icon: ShieldCheck,
    title: "Human-in-the-loop by default",
    description:
      "Every complex or sensitive query pauses for human review before sending. You stay in control without monitoring every message.",
  },
  {
    icon: Zap,
    title: "Set up in 30 minutes",
    description:
      "No engineers, no integrations team, no six-week onboarding. Connect your channels, upload your docs, go live.",
  },
  {
    icon: Users,
    title: "Hire a whole team",
    description:
      "Start with support. Add an SDR. Bring on an ops coordinator. Each AI employee has a distinct role, persona, and skillset.",
  },
  {
    icon: BarChart3,
    title: "Full analytics",
    description:
      "Resolution rate, escalation rate, conversation volume, CSAT — all in one dashboard so you can improve over time.",
  },
];

export function Features() {
  return (
    <section id="product" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Everything you need in{" "}
            <span className="gradient-text">one AI workforce</span>
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Aria isn't a chatbot. It's a team of purpose-built AI employees that think,
            learn, and act — so you don't have to.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="glass-card rounded-2xl p-6 hover:border-white/12 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <f.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold text-base mb-2">{f.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
