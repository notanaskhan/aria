"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { GradientButton } from "@/components/ui/GradientButton";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    description: "Try Aria with one employee",
    features: [
      "1 AI employee",
      "100 conversations/mo",
      "Web chat widget",
      "Basic knowledge base (3 sources)",
      "Community support",
    ],
    cta: "Start free",
    ctaHref: "https://app.aria.ai/signup",
    featured: false,
  },
  {
    name: "Starter",
    price: "$149",
    period: "/mo per employee",
    description: "For growing teams ready to automate",
    features: [
      "3 AI employees",
      "2,000 conversations/mo",
      "Slack + WhatsApp + email",
      "Unlimited knowledge base",
      "Human escalation workflows",
      "Analytics dashboard",
      "Email support",
    ],
    cta: "Start 14-day trial",
    ctaHref: "https://app.aria.ai/signup?plan=starter",
    featured: true,
  },
  {
    name: "Growth",
    price: "$399",
    period: "/mo per employee",
    description: "Scale your AI workforce",
    features: [
      "10 AI employees",
      "Unlimited conversations",
      "All channels + custom integrations",
      "Priority LLM routing",
      "Advanced analytics + CSAT",
      "Notion / Confluence connectors",
      "Priority support",
    ],
    cta: "Start 14-day trial",
    ctaHref: "https://app.aria.ai/signup?plan=growth",
    featured: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Dedicated infrastructure for your team",
    features: [
      "Unlimited AI employees",
      "Dedicated deployment",
      "Bring your own LLM",
      "SSO (SAML / OIDC)",
      "SOC 2 Type II",
      "White-labeling",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    cta: "Book a demo",
    ctaHref: "https://cal.com/aria-demo",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Start free.{" "}
            <span className="gradient-text">Scale as you grow.</span>
          </h2>
          <p className="text-text-muted text-lg">
            No per-seat engineering costs. Pay for the employees that work.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`relative rounded-2xl p-6 flex flex-col ${
                plan.featured
                  ? "bg-accent/10 border-2 border-accent/50"
                  : "glass-card"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-brand text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <p className="text-text-muted text-sm font-medium mb-1">{plan.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-text-muted text-xs">{plan.period}</span>
                  )}
                </div>
                <p className="text-text-muted text-xs mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-3.5 h-3.5 text-accent-emerald mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">{f}</span>
                  </li>
                ))}
              </ul>

              {plan.featured ? (
                <GradientButton href={plan.ctaHref} className="w-full justify-center">
                  {plan.cta}
                </GradientButton>
              ) : (
                <a
                  href={plan.ctaHref}
                  className="w-full px-4 py-2.5 rounded-full border border-white/10 text-sm font-medium text-center hover:border-white/25 hover:text-white text-text-muted transition-all duration-200"
                >
                  {plan.cta}
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
