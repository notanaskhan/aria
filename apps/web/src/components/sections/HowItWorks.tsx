"use client";
import { motion } from "framer-motion";
import { Upload, Plug, Rocket } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Train on your knowledge",
    description:
      "Upload your docs, FAQs, policies, and product info. Aria indexes everything and only answers from what you've provided.",
  },
  {
    step: "02",
    icon: Plug,
    title: "Connect your channels",
    description:
      "Link Slack, WhatsApp, your website chat, or email in a few clicks. Each channel gets the same AI employee.",
  },
  {
    step: "03",
    icon: Rocket,
    title: "Go live and improve",
    description:
      "Your AI employee starts handling conversations immediately. Review the analytics dashboard and tune over time.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-6 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Up and running in{" "}
            <span className="gradient-text">three steps</span>
          </h2>
          <p className="text-text-muted text-lg">
            No engineers. No six-week onboarding. Just results.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-[calc(50%-0.5px)] top-8 bottom-8 w-px bg-gradient-to-b from-accent/30 via-accent/10 to-transparent hidden md:block" />
          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-8 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
              >
                <div className="flex-1 glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-accent/15 border border-accent/25 flex items-center justify-center">
                      <step.icon className="w-4 h-4 text-accent" />
                    </div>
                    <span className="text-accent font-bold text-sm font-mono">{step.step}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{step.description}</p>
                </div>

                <div className="hidden md:flex w-8 h-8 rounded-full bg-accent/20 border-2 border-accent/40 flex-shrink-0 items-center justify-center z-10">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                </div>

                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
