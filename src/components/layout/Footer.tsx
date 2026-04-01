import { NAME } from "../../lib/constants";

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "Download", href: "#download" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Plugin API", href: "#" },
      { label: "MCP Reference", href: "#" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Discord", href: "#" },
      { label: "Twitter / X", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-border border-t bg-surface-2">
      <div className="mx-auto max-w-content px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/app-icon.png" alt={NAME.full} className="h-6 w-6" />
              <span className="font-mono font-semibold text-sm text-text">
                {NAME.short}
              </span>
            </div>
            <p className="mt-3 text-sm text-text-muted leading-relaxed">
              A database browser for <span className="text-text/50">developers</span>.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 font-mono text-[10px] text-text-muted uppercase tracking-widest">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-text-secondary transition-colors hover:text-text"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-border border-t pt-6 sm:flex-row">
          <p className="font-mono text-text-muted text-xs">
            &copy; {new Date().getFullYear()} Make Toast LLC
          </p>
          <p className="font-mono text-text-muted text-xs">
            Built with <a href="https://tauri.app" className="underline hover:text-text">Tauri</a>,{' '}
            <a href="https://react.dev" className="underline hover:text-text">React</a>, and a lot of <span className="text-text text-xl">☕</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}
