import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAME } from "../../lib/constants";

const navItems = [
  { label: "Features", href: "#features", color: "#44ff88" },
  { label: "Plugins", href: "#plugins", color: "#cc44ff" },
  { label: "MCP", href: "#mcp", color: "#00d4ff" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 sm:top-4 sm:flex sm:justify-center sm:px-4">
        {/* Mobile: full-width bar / Desktop: centered pill */}
        <nav
          className={`flex items-center px-4 py-2.5 transition-all duration-300 sm:rounded-full sm:border sm:px-2 sm:py-1.5 ${
            scrolled || menuOpen
              ? "border-b border-border-strong bg-surface/50 shadow-black/50 shadow-lg backdrop-blur-md sm:border"
              : "border-b border-transparent bg-bg/80 backdrop-blur-sm sm:border sm:border-border sm:bg-surface/80"
          }`}
        >
          <a href="#" className="flex items-center gap-3 px-1 py-0.5 sm:px-2">
            <img src="/app-icon.png" alt="slashtable" className="h-5 w-5" />
            <span className="font-mono font-semibold text-sm text-text tracking-tight">
              {NAME.short}
            </span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden items-center sm:flex">
            <div className="mx-2 h-4 w-px bg-border-strong" />
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] text-text/70 uppercase tracking-widest transition-colors hover:text-text"
              >
                <span
                  className="h-1.5 w-1.5 shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                {item.label}
              </a>
            ))}
            <div className="mx-2 h-4 w-px bg-border-strong" />
          </div>

          {/* Desktop CTA */}
          <a
            href="#download"
            className="ml-1 hidden items-center rounded-full bg-accent px-4 py-1.5 font-mono text-[10px] text-black uppercase tracking-widest transition-colors hover:bg-white sm:inline-flex"
          >
            Download
          </a>

          {/* Mobile hamburger */}
          <button
            className="ml-auto p-1 text-text-muted transition-colors hover:text-text sm:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </header>

      {/* Mobile fullscreen menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col bg-bg pt-12 sm:hidden">
          <div className="flex flex-col gap-3 px-4 py-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-4 border border-border bg-surface px-5 py-4 font-mono text-sm text-text uppercase tracking-widest transition-colors hover:bg-surface-2"
              >
                <span
                  className="h-3 w-3 flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
