"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { GradientButton } from "@/components/ui/GradientButton";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-semibold text-lg tracking-tight">Aria</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[
            ["Product", "#product"],
            ["Roles", "#roles"],
            ["Pricing", "#pricing"],
            ["Docs", "/docs"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="text-sm text-text-muted hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="https://app.aria.ai/login"
            className="text-sm text-text-muted hover:text-white transition-colors hidden md:block"
          >
            Sign in
          </Link>
          <GradientButton href="https://app.aria.ai/signup" size="sm">
            Start free
          </GradientButton>
        </div>
      </div>
    </nav>
  );
}
