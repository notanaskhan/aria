"use client";
import { motion } from "framer-motion";

const integrations = [
  { name: "Slack", category: "Messaging" },
  { name: "WhatsApp", category: "Messaging" },
  { name: "Gmail", category: "Email" },
  { name: "HubSpot", category: "CRM" },
  { name: "Salesforce", category: "CRM" },
  { name: "Zendesk", category: "Support" },
  { name: "Notion", category: "Knowledge" },
  { name: "Confluence", category: "Knowledge" },
  { name: "Google Drive", category: "Files" },
  { name: "Stripe", category: "Payments" },
  { name: "Shopify", category: "E-commerce" },
  { name: "Linear", category: "Engineering" },
];

export function Integrations() {
  return (
    <section className="py-24 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Works with your{" "}
            <span className="gradient-text">existing stack</span>
          </h2>
          <p className="text-text-muted text-lg max-w-xl mx-auto">
            Aria connects to the tools you already use — so your AI employees
            fit into your workflow, not the other way around.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {integrations.map((integration, i) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="glass-card rounded-xl p-4 text-center hover:border-white/15 transition-all duration-200 group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/8 mx-auto mb-2 flex items-center justify-center group-hover:bg-white/12 transition-colors">
                <span className="text-white/60 text-xs font-bold">
                  {integration.name[0]}
                </span>
              </div>
              <p className="text-white text-xs font-medium">{integration.name}</p>
              <p className="text-text-muted text-xs mt-0.5">{integration.category}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
