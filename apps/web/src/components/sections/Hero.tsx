"use client";
import { motion } from "framer-motion";
import { GradientButton } from "@/components/ui/GradientButton";
import { ArrowRight, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-6">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-sm font-medium mb-8"
        >
          <Zap className="w-3.5 h-3.5" />
          Now in early access — join 200+ businesses
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6"
        >
          Hire your first{" "}
          <span className="gradient-text">AI employee</span>
          {" "}in 10 minutes.
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Aria gives you pre-built AI employees for customer support, sales, and operations
          — connected to your channels, trained on your knowledge, ready to work 24/7.
          No engineers needed.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <GradientButton href="https://app.aria.ai/signup" size="lg">
            Start free — no credit card
            <ArrowRight className="w-4 h-4 ml-1" />
          </GradientButton>
          <a
            href="https://cal.com/aria-demo"
            className="px-6 py-3 rounded-full border border-white/10 text-sm font-medium text-text-muted hover:text-white hover:border-white/20 transition-all duration-200"
          >
            Book a demo
          </a>
        </motion.div>

        {/* Social proof mini */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 flex items-center justify-center gap-6 text-sm text-text-muted"
        >
          {["14-day free trial", "Set up in 30 min", "No engineers needed"].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald" />
              {item}
            </span>
          ))}
        </motion.div>

        {/* Hero visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <div className="glass-card rounded-2xl overflow-hidden glow-brand">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
              <div className="flex gap-1.5">
                {["#FF5F57", "#FFBD2E", "#28CA41"].map((c) => (
                  <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
                ))}
              </div>
              <div className="flex-1 mx-4 bg-white/5 rounded-full px-3 py-1 text-xs text-text-muted text-center">
                Aria Customer Support — Acme Corp
              </div>
            </div>

            <div className="p-6 space-y-4 text-left text-sm">
              <ChatBubble role="user" text="Hi! I placed an order 3 days ago (order #45231) but haven't received a shipping confirmation yet." />
              <ChatBubble
                role="aria"
                text="Hi there! Let me look that up for you right away. I can see order #45231 was placed on Monday — it's currently being processed at our fulfillment center and a shipping confirmation email will be sent within the next 24 hours. Your estimated delivery is Friday. Is there anything else I can help with?"
                isStreaming
              />
              <ChatBubble role="user" text="That's great, thanks! Can I change the delivery address?" />
              <ChatBubble
                role="aria"
                text="Absolutely! Since your order hasn't shipped yet, I can update the address. Please share the new delivery address and I'll get that updated immediately."
              />
            </div>

            <div className="px-6 pb-4">
              <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                <span className="text-sm text-text-muted flex-1">Type a message...</span>
                <div className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ChatBubble({
  role,
  text,
  isStreaming,
}: {
  role: "user" | "aria";
  text: string;
  isStreaming?: boolean;
}) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="bg-white/8 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[75%] text-white/80">
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-full bg-gradient-brand flex-shrink-0 flex items-center justify-center mt-0.5">
        <span className="text-white text-xs font-bold">A</span>
      </div>
      <div className="bg-accent/10 border border-accent/20 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[80%]">
        <p className="text-white/90">{text}</p>
        {isStreaming && (
          <div className="flex gap-1 mt-1.5">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        )}
      </div>
    </div>
  );
}
