"use client";
import { motion } from "framer-motion";
import { GradientButton } from "@/components/ui/GradientButton";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-12 border border-accent/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-radial from-accent/10 via-transparent to-transparent pointer-events-none" />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Ready to hire your first{" "}
              <span className="gradient-text">AI employee?</span>
            </h2>
            <p className="text-text-muted text-lg mb-8 max-w-lg mx-auto">
              Join hundreds of businesses using Aria to handle support, sales,
              and operations — 24/7, at a fraction of the cost.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <GradientButton href="https://app.aria.ai/signup" size="lg">
                Start free — 14-day trial
                <ArrowRight className="w-4 h-4 ml-1" />
              </GradientButton>
              <a
                href="https://cal.com/aria-demo"
                className="px-6 py-3 rounded-full border border-white/10 text-sm font-medium hover:border-white/25 hover:text-white text-text-muted transition-all"
              >
                Book a demo
              </a>
            </div>
            <p className="text-text-muted text-xs mt-6">
              No credit card required · Set up in 30 minutes · Cancel anytime
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
