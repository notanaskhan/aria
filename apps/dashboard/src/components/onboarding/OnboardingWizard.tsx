"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Headphones, TrendingUp, Settings, ChevronRight, Check, Upload, Link, Slack, MessageCircle, Mail } from "lucide-react";

const STEPS = ["Role", "Configure", "Knowledge", "Channels", "Review"];

const roles = [
  {
    id: "customer_support",
    icon: Headphones,
    label: "Customer Support",
    description: "Handles inbound questions 24/7, resolves tickets, escalates complex issues.",
    bestFor: "E-commerce, SaaS, agencies",
  },
  {
    id: "sdr",
    icon: TrendingUp,
    label: "Sales Development Rep",
    description: "Researches leads, writes personalized outreach, manages follow-up sequences.",
    bestFor: "Sales teams, B2B companies",
  },
  {
    id: "ops_coordinator",
    icon: Settings,
    label: "Ops Coordinator",
    description: "Handles scheduling, internal requests, status updates, and reporting.",
    bestFor: "Operations teams, agencies",
  },
];

const channels = [
  { id: "web", icon: MessageCircle, label: "Web widget", description: "Embed on your website" },
  { id: "slack", icon: Slack, label: "Slack", description: "Connect to your workspace" },
  { id: "whatsapp", icon: MessageCircle, label: "WhatsApp", description: "Business account required" },
  { id: "email", icon: Mail, label: "Email", description: "Connect Gmail or Outlook" },
];

export function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [persona, setPersona] = useState("");
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["web"]);
  const [kbUrl, setKbUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canProceed = [
    selectedRole !== null,
    name.trim().length > 0,
    true,
    selectedChannels.length > 0,
    true,
  ][step];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    window.location.href = "/dashboard/employees";
  };

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                i < step
                  ? "bg-[#10B981] text-white"
                  : i === step
                  ? "bg-[#6366F1] text-white"
                  : "bg-white/8 text-[#94A3B8]"
              }`}
            >
              {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className={`text-xs hidden sm:block ${i === step ? "text-white" : "text-[#94A3B8]"}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-6 ${i < step ? "bg-[#10B981]" : "bg-white/10"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="glass-card rounded-2xl p-6 mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {step === 0 && (
              <div>
                <h2 className="font-semibold text-lg mb-1">Choose a role</h2>
                <p className="text-[#94A3B8] text-sm mb-5">What kind of AI employee do you need?</p>
                <div className="space-y-3">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                        selectedRole === role.id
                          ? "border-[#6366F1]/50 bg-[#6366F1]/10"
                          : "border-white/7 hover:border-white/15 hover:bg-white/3"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        selectedRole === role.id ? "bg-[#6366F1]/20" : "bg-white/5"
                      }`}>
                        <role.icon className={`w-5 h-5 ${selectedRole === role.id ? "text-[#6366F1]" : "text-[#94A3B8]"}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{role.label}</p>
                        <p className="text-[#94A3B8] text-xs mt-0.5">{role.description}</p>
                        <p className="text-[#6366F1] text-xs mt-1">Best for: {role.bestFor}</p>
                      </div>
                      {selectedRole === role.id && (
                        <Check className="w-4 h-4 text-[#6366F1] flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="font-semibold text-lg mb-1">Configure your employee</h2>
                <p className="text-[#94A3B8] text-sm mb-5">Give them a name and personality.</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Employee name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex, Support Bot, Aria Support"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#6366F1]/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Persona instructions{" "}
                      <span className="text-[#94A3B8] font-normal">(optional)</span>
                    </label>
                    <textarea
                      value={persona}
                      onChange={(e) => setPersona(e.target.value)}
                      placeholder="e.g. Always be friendly and concise. Use the customer's first name. Never discuss competitor products."
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#6366F1]/50 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="font-semibold text-lg mb-1">Add your knowledge base</h2>
                <p className="text-[#94A3B8] text-sm mb-5">
                  Your AI employee will only answer from what you provide here.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Add a URL</label>
                    <div className="flex gap-2">
                      <input
                        value={kbUrl}
                        onChange={(e) => setKbUrl(e.target.value)}
                        placeholder="https://docs.yourcompany.com"
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#6366F1]/50"
                      />
                      <button className="px-4 py-3 rounded-xl bg-[#6366F1]/15 text-[#6366F1] text-sm font-medium hover:bg-[#6366F1]/25 transition-colors">
                        Add
                      </button>
                    </div>
                  </div>
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-white/20 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
                    <p className="text-sm font-medium mb-1">Drop files here or click to upload</p>
                    <p className="text-[#94A3B8] text-xs">PDF, DOCX up to 20MB each</p>
                  </div>
                  <p className="text-[#94A3B8] text-xs text-center">
                    You can also skip this step and add knowledge later
                  </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="font-semibold text-lg mb-1">Connect your channels</h2>
                <p className="text-[#94A3B8] text-sm mb-5">
                  Where should your AI employee show up?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {channels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => {
                        setSelectedChannels((prev) =>
                          prev.includes(channel.id)
                            ? prev.filter((c) => c !== channel.id)
                            : [...prev, channel.id]
                        );
                      }}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedChannels.includes(channel.id)
                          ? "border-[#6366F1]/50 bg-[#6366F1]/10"
                          : "border-white/7 hover:border-white/15"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <channel.icon className={`w-5 h-5 ${selectedChannels.includes(channel.id) ? "text-[#6366F1]" : "text-[#94A3B8]"}`} />
                        {selectedChannels.includes(channel.id) && (
                          <Check className="w-3.5 h-3.5 text-[#6366F1]" />
                        )}
                      </div>
                      <p className="font-medium text-sm">{channel.label}</p>
                      <p className="text-[#94A3B8] text-xs mt-0.5">{channel.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="font-semibold text-lg mb-1">Review and launch</h2>
                <p className="text-[#94A3B8] text-sm mb-5">
                  Your AI employee is ready to go live.
                </p>
                <div className="space-y-3">
                  {[
                    ["Role", roles.find((r) => r.id === selectedRole)?.label ?? "—"],
                    ["Name", name || "—"],
                    ["Channels", selectedChannels.join(", ") || "—"],
                    ["Knowledge base", kbUrl ? "1 URL queued" : "None (add later)"],
                    ["Guardrails", "Enabled"],
                    ["Human escalation", "Enabled"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between py-2.5 border-b border-white/5">
                      <span className="text-[#94A3B8] text-sm">{label}</span>
                      <span className="text-sm font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="px-4 py-2 text-sm text-[#94A3B8] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#6366F1] to-[#3B82F6] text-white text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            Continue
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#6366F1] to-[#3B82F6] text-white text-sm font-medium hover:opacity-90 disabled:opacity-70 transition-opacity"
          >
            {isSubmitting ? "Launching..." : "Launch employee"}
          </button>
        )}
      </div>
    </div>
  );
}
