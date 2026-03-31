const footerSections = [
  {
    title: "Product",
    links: [
      { label: "Download", href: "#download" },
      { label: "Changelog", href: "#" },
      { label: "GitHub", href: "#" },
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
      { label: "GitHub Discussions", href: "#" },
      { label: "Twitter / X", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-2">
      <div className="mx-auto max-w-[68rem] px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/app-icon.png" alt="SlashTable" className="h-6 w-6" />
              <span className="font-mono text-sm font-semibold text-text">
                SlashTable
              </span>
            </div>
            <p className="mt-3 text-sm text-text-muted leading-relaxed">
              A database browser for the age of agents.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-mono text-[10px] tracking-widest text-text-muted uppercase mb-4">
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

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="font-mono text-xs text-text-muted">
            &copy; {new Date().getFullYear()} SlashTable
          </p>
          <p className="font-mono text-xs text-text-muted">
            Built with Tauri, React, and Rust.
          </p>
        </div>
      </div>
    </footer>
  );
}
