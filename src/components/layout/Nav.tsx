import { useEffect, useState } from "react";
import { NAME } from "../../lib/constants";

const navItems = [
  { label: "Features", href: "#features", color: "#44ff88" },
  { label: "Plugins", href: "#plugins", color: "#cc44ff" },
  { label: "MCP", href: "#mcp", color: "#00d4ff" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <nav
        className={`flex items-center rounded-full border px-2 py-1.5 transition-all duration-300 ${
          scrolled
            ? "border-border-strong bg-surface/50 shadow-lg shadow-black/50 backdrop-blur-md"
            : "border-border bg-surface/80 backdrop-blur-sm"
        }`}
      >
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 px-2 py-0.5">
          <img src="/app-icon.png" alt="slashtable" className="h-5 w-5" />
          <span className="font-mono text-sm font-semibold tracking-tight text-text">
            {NAME.short}
          </span>
        </a>

        {/* Nav links — hidden on mobile */}
        <div className="hidden sm:flex items-center">
          <div className="h-4 w-px bg-border-strong mx-2" />
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] tracking-widest uppercase text-text/70 transition-colors hover:text-text"
            >
              <span
                className="h-1.5 w-1.5 flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </a>
          ))}
          <div className="h-4 w-px bg-border-strong mx-2" />
        </div>

        {/* CTA */}
        <a
          href="#download"
          className="ml-1 inline-flex items-center rounded-full bg-cyan px-4 py-1.5 font-mono text-[10px] tracking-widest uppercase text-black transition-colors hover:bg-white"
        >
          Download
        </a>
      </nav>
    </header>
  );
}
