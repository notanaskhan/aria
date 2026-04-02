import Link from "next/link";

const links = {
  Product: [
    ["Customer Support", "/roles/support"],
    ["SDR", "/roles/sdr"],
    ["Ops Coordinator", "/roles/ops"],
    ["Integrations", "/integrations"],
    ["Pricing", "/#pricing"],
  ],
  Resources: [
    ["Documentation", "/docs"],
    ["API Reference", "/docs/api"],
    ["Changelog", "/changelog"],
    ["Status", "https://status.aria.ai"],
  ],
  Company: [
    ["About", "/about"],
    ["Blog", "/blog"],
    ["Careers", "/careers"],
    ["Contact", "/contact"],
  ],
  Legal: [
    ["Privacy Policy", "/privacy"],
    ["Terms of Service", "/terms"],
    ["Security", "/security"],
    ["SOC 2", "/security#soc2"],
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-semibold text-lg">Aria</span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed">
              Your AI workforce, built for business.
            </p>
          </div>

          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <p className="font-semibold text-sm mb-4">{section}</p>
              <ul className="space-y-2.5">
                {items.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-text-muted text-sm hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">© 2026 Aria, Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {[
              ["Twitter", "https://twitter.com/ariaai"],
              ["LinkedIn", "https://linkedin.com/company/ariaai"],
              ["GitHub", "https://github.com/ariaai"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="text-text-muted text-sm hover:text-white transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
