import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NAME } from "../../lib/constants";

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
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 sm:top-4 sm:flex sm:justify-center sm:px-4">
        {/* Mobile: full-width bar / Desktop: centered pill */}
        <nav
          className={`flex items-center px-4 py-2.5 transition-all duration-300 sm:rounded-full sm:border sm:px-2 sm:py-1.5 ${
            scrolled || menuOpen
              ? "border-border-strong border-b bg-surface/50 shadow-black/50 shadow-lg backdrop-blur-md sm:border"
              : "border-transparent border-b bg-bg/80 backdrop-blur-sm sm:border sm:border-border sm:bg-surface/80"
          }`}
        >
          <Link to="/" className="flex items-center gap-3 px-1 py-0.5 sm:px-2">
            <img src="/app-icon.png" alt="slashtable" className="h-5 w-5" />
            <span className="font-mono font-semibold text-sm text-text tracking-tight">{NAME.short}</span>
          </Link>

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
            <a
              href="#download"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-4 border border-border bg-surface px-5 py-4 font-mono text-sm text-text uppercase tracking-widest transition-colors hover:bg-surface-2"
            >
              <span className="h-3 w-3 shrink-0" style={{ backgroundColor: "#44ff88" }} />
              Download
            </a>
          </div>
        </div>
      )}
    </>
  );
}
