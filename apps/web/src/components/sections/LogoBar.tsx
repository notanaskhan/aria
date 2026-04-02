"use client";
import { motion } from "framer-motion";

const companies = [
  "Acme Corp", "Brightwave", "Luma Health", "Stackforge",
  "Meridian", "Helios", "Novex", "Crestline",
];

export function LogoBar() {
  return (
    <section className="py-12 border-y border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-sm text-text-muted mb-8">
          Trusted by fast-growing teams worldwide
        </p>
        <div className="flex items-center justify-center flex-wrap gap-8 md:gap-12">
          {companies.map((name, i) => (
            <motion.span
              key={name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="text-text-muted/60 font-semibold text-sm tracking-wide uppercase hover:text-text-muted transition-colors cursor-default"
            >
              {name}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
