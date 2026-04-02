"use client";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "We went from 4-hour average response times to under 2 minutes. Our support team now only handles genuinely complex cases. Aria handles everything else.",
    name: "Sarah Chen",
    title: "Head of Customer Success",
    company: "Stackforge",
  },
  {
    quote:
      "Set it up on a Friday afternoon. By Monday morning it had already resolved 47 tickets without a single escalation. The ROI is insane.",
    name: "Marcus Webb",
    title: "CEO",
    company: "Brightwave",
  },
  {
    quote:
      "The human-in-the-loop feature was the dealbreaker for us. We wanted AI help but couldn't risk bad responses going to customers. Aria solved that.",
    name: "Priya Nair",
    title: "VP Operations",
    company: "Luma Health",
  },
  {
    quote:
      "Our SDR was drowning in manual outreach. Aria's SDR employee now handles first-touch personalization for every lead. Close rate is actually up.",
    name: "Jake Owens",
    title: "Sales Director",
    company: "Meridian",
  },
  {
    quote:
      "We're a 12-person team competing against companies 10x our size. Aria gives us the operational capacity of a 30-person team without the headcount.",
    name: "Anika Foster",
    title: "Founder",
    company: "Helios",
  },
  {
    quote:
      "The knowledge base setup took 20 minutes. I uploaded our docs, connected Slack, and it was live. No engineers, no API keys, no drama.",
    name: "Tom Brecker",
    title: "COO",
    company: "Novex",
  },
];

export function Testimonials() {
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
            Teams that switched to{" "}
            <span className="gradient-text">Aria</span>
          </h2>
        </motion.div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="glass-card rounded-2xl p-6 break-inside-avoid"
            >
              <p className="text-white/80 text-sm leading-relaxed mb-5">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">{t.name[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-text-muted text-xs">
                    {t.title}, {t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
