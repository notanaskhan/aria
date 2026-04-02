/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        background: "#08080F",
        surface: "#111118",
        "text-muted": "#94A3B8",
        accent: {
          DEFAULT: "#6366F1",
          blue: "#3B82F6",
          emerald: "#10B981",
        },
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #6366F1, #3B82F6)",
      },
    },
  },
  plugins: [],
};
