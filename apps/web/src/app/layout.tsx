import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aria — Your AI Workforce, Built for Business",
  description:
    "Hire AI employees for customer support, sales, and operations. Set up in 30 minutes. Works across Slack, WhatsApp, email, and your website.",
  keywords: ["AI employees", "AI agents", "customer support automation", "AI SDR", "business AI"],
  openGraph: {
    title: "Aria — Your AI Workforce, Built for Business",
    description:
      "Hire AI employees for customer support, sales, and operations.",
    url: "https://aria.ai",
    siteName: "Aria",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aria — Your AI Workforce",
    description: "Hire AI employees for customer support, sales, and operations.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script src="https://cdn.tailwindcss.com" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: {
                  extend: {
                    colors: {
                      background: '#08080F',
                      surface: '#111118',
                      'text-muted': '#94A3B8',
                      accent: { DEFAULT: '#6366F1', blue: '#3B82F6', emerald: '#10B981' }
                    },
                    fontFamily: {
                      sans: ['Inter', 'system-ui', 'sans-serif'],
                    },
                    backgroundImage: {
                      'gradient-brand': 'linear-gradient(135deg, #6366F1, #3B82F6)',
                      'gradient-glow': 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.15), transparent 70%)',
                    }
                  }
                }
              }
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
        style={{ backgroundColor: '#08080F', color: 'white' }}
      >
        {children}
      </body>
    </html>
  );
}
