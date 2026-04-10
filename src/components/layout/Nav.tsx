import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NAME } from "../../lib/constants";
import { NAV } from "../../lib/copy";

const mobileColors = ["#44ff88", "#00d4ff", "#cc44ff"];

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
            <img src="/app-icon.png" alt={NAV.logoAlt} className="h-5 w-5" />
            <span className="font-mono font-semibold text-sm text-text tracking-tight">{NAME.short}</span>
          </Link>

          {/* Desktop nav links */}
          <div className="ml-3 hidden items-center gap-1 sm:flex">
            <span className="mx-1 h-3 w-px bg-border" />
            {NAV.desktopLinks.map((link) => (
              <Link
                key={link.label}
                to="/"
                hash={link.hash}
                className="px-2.5 py-1 font-mono text-[10px] text-text-muted uppercase tracking-widest transition-colors hover:text-text"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/pricing"
              className="px-2.5 py-1 font-mono text-[10px] text-text-muted uppercase tracking-widest transition-colors hover:text-text"
            >
              {NAV.pricing}
            </Link>
            <Link
              to="/changelog"
              className="px-2.5 py-1 font-mono text-[10px] text-text-muted uppercase tracking-widest transition-colors hover:text-text"
            >
              {NAV.changelog}
            </Link>
          </div>

          {/* Desktop CTA */}
          <Link
            to="/"
            hash="download"
            className="ml-1 hidden items-center rounded-full bg-accent px-4 py-1.5 font-mono text-[10px] text-black uppercase tracking-widest transition-colors hover:bg-white sm:inline-flex"
          >
            {NAV.download}
          </Link>

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
          <div className="flex flex-col gap-2 px-4 py-4">
            {NAV.mobileLinks.map((link, i) => (
              <Link
                key={link.label}
                to="/"
                hash={link.hash}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-4 border border-border bg-surface px-5 py-3.5 font-mono text-sm text-text-secondary uppercase tracking-widest transition-colors hover:bg-surface-2 hover:text-text"
              >
                <span className="h-2 w-2 shrink-0" style={{ backgroundColor: mobileColors[i] }} />
                {link.label}
              </Link>
            ))}
            <Link
              to="/pricing"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-4 border border-border bg-surface px-5 py-3.5 font-mono text-sm text-text-secondary uppercase tracking-widest transition-colors hover:bg-surface-2 hover:text-text"
            >
              <span className="h-2 w-2 shrink-0" style={{ backgroundColor: "#ffcc00" }} />
              {NAV.pricing}
            </Link>
            <Link
              to="/changelog"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-4 border border-border bg-surface px-5 py-3.5 font-mono text-sm text-text-secondary uppercase tracking-widest transition-colors hover:bg-surface-2 hover:text-text"
            >
              <span className="h-2 w-2 shrink-0" style={{ backgroundColor: "#c94a00" }} />
              {NAV.changelog}
            </Link>
            <Link
              to="/"
              hash="download"
              onClick={() => setMenuOpen(false)}
              className="mt-1 flex items-center justify-center gap-3 rounded-full bg-accent px-5 py-3.5 font-mono text-sm text-black uppercase tracking-widest transition-colors hover:bg-white"
            >
              {NAV.download}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
