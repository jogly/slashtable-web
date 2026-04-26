"use client";

import { BookOpen, ChevronDown, KeyRound, Menu, Network, ShieldCheck, Terminal, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import appIconImg from "../../assets/app-icon.png";
import { NAME } from "../../lib/constants";
import { NAV } from "../../lib/copy";
import { ButtonOverlays } from "../ui/ButtonOverlays";
import { ThemeToggle } from "../ui/ThemeToggle";

const featurePopoverItems = [
  {
    label: "MCP Server",
    description: "AI-safe access to your schema and data.",
    hash: "mcp",
    icon: ShieldCheck,
    color: "var(--color-cyan)",
  },
  {
    label: "Schema Graph",
    description: "Auto-layout ER diagrams of your database.",
    hash: "schema",
    icon: Network,
    color: "var(--color-magenta)",
  },
  {
    label: "Navigation",
    description: "Click through foreign keys with breadcrumbs.",
    hash: "features",
    icon: BookOpen,
    color: "var(--color-green)",
  },
  {
    label: "Plugins",
    description: "Bring your own code — TypeScript plugins.",
    hash: "plugins",
    icon: Terminal,
    color: "var(--color-yellow)",
  },
  {
    label: "Credential Vaults",
    description: "Keychain, 1Password, zero passwords in shell.",
    hash: "features",
    icon: KeyRound,
    color: "var(--color-orange)",
  },
];

export function Nav() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
  const downloadRef = useRef<HTMLAnchorElement>(null);

  function openPopover() {
    window.clearTimeout(closeTimer.current);
    openTimer.current = window.setTimeout(() => setPopoverOpen(true), 60);
  }

  function closePopover() {
    window.clearTimeout(openTimer.current);
    closeTimer.current = window.setTimeout(() => setPopoverOpen(false), 120);
  }

  useEffect(() => {
    return () => {
      window.clearTimeout(openTimer.current);
      window.clearTimeout(closeTimer.current);
    };
  }, []);

  // Mobile menu body lock
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Keyboard shortcut: press "d" to trigger the download link
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "d" && e.key !== "D") return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      e.preventDefault();
      downloadRef.current?.click();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 border-border border-b border-dashed bg-bg/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-content items-center gap-6 px-4 py-3 sm:px-6 sm:py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <img src={appIconImg.src} alt={NAV.logoAlt} width={18} height={18} className="h-[18px] w-[18px]" />
            <span className="font-mono font-semibold text-[13px] text-text tracking-tight">{NAME.short}</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-5 sm:flex">
            <div className="relative" onMouseEnter={openPopover} onMouseLeave={closePopover}>
              <button
                type="button"
                className={`flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest transition-colors ${popoverOpen ? "text-text" : "text-text-muted hover:text-text"}`}
              >
                Features
                <ChevronDown
                  className={`h-3 w-3 transition-transform duration-200 ${popoverOpen ? "rotate-180" : ""}`}
                  strokeWidth={1.5}
                />
              </button>

              {/* Invisible hover bridge so the cursor can travel from button to popover without closing */}
              {popoverOpen && <div className="absolute top-full left-0 h-4 w-[520px]" aria-hidden="true" />}

              {popoverOpen && (
                <div className="absolute top-full left-0 z-50 mt-4 w-[520px] border border-border border-dashed bg-bg/95 p-1 shadow-shadow shadow-xl backdrop-blur-md">
                  <div className="grid grid-cols-2">
                    {featurePopoverItems.map((item) => (
                      <Link
                        key={item.label}
                        href={`/#${item.hash}`}
                        onClick={() => setPopoverOpen(false)}
                        className="group flex items-start gap-3 border border-transparent p-3 transition-colors hover:border-border hover:bg-border/10"
                      >
                        <span
                          className="mt-0.5 h-2 w-2 shrink-0"
                          style={{ backgroundColor: item.color }}
                          aria-hidden="true"
                        />
                        <div>
                          <div className="font-display text-[13px] text-text">{item.label}</div>
                          <div className="mt-0.5 text-[10.5px] text-text-muted leading-relaxed">{item.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/pricing"
              className="font-mono text-[11px] text-text-muted uppercase tracking-widest transition-colors hover:text-text"
            >
              {NAV.pricing}
            </Link>
            <Link
              href="/changelog"
              className="font-mono text-[11px] text-text-muted uppercase tracking-widest transition-colors hover:text-text"
            >
              {NAV.changelog}
            </Link>
          </div>

          {/* Right cluster: theme toggle + CTA (desktop) */}
          <div className="ml-auto hidden items-center gap-4 sm:flex">
            <ThemeToggle />
            <Link
              ref={downloadRef}
              href="/#download"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-[4px] bg-accent py-1.5 pr-1.5 pl-3.5 font-mono text-[11px] text-white uppercase tracking-widest shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.12)] transition-[background-color,box-shadow] duration-150 hover:bg-[color-mix(in_srgb,var(--color-accent)_92%,white)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.12)] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.12)]"
            >
              <ButtonOverlays grainOpacity={0.14} />
              <span className="relative">{NAV.download}</span>
              <kbd
                className="relative flex h-5 w-5 items-center justify-center rounded-[2px] border border-white/25 bg-black/20 font-mono text-[10px] text-white/95 transition-colors duration-150 group-hover:border-white/40 group-hover:bg-black/30"
                aria-label="Keyboard shortcut D"
              >
                D
              </kbd>
            </Link>
          </div>

          {/* Mobile theme toggle + hamburger */}
          <div className="ml-auto flex items-center gap-1 sm:hidden">
            <ThemeToggle />
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="p-1.5 text-text-muted transition-colors hover:text-text"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile fullscreen menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex animate-[menuSlideIn_0.25s_ease-out] flex-col bg-bg/95 pt-[60px] backdrop-blur-xl sm:hidden">
          <div className="relative flex flex-1 flex-col overflow-y-auto px-5 pt-6 pb-8">
            {/* All nav items in one unified list */}
            <div className="space-y-px">
              {featurePopoverItems.map((item) => (
                <Link
                  key={item.label}
                  href={`/#${item.hash}`}
                  onClick={() => setMenuOpen(false)}
                  className="group flex items-start gap-3.5 border border-transparent px-3 py-3 transition-colors hover:border-border hover:border-dashed hover:bg-surface/50"
                >
                  <span
                    className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                    aria-hidden="true"
                  />
                  <div>
                    <div className="font-display text-[14px] text-text">{item.label}</div>
                    <div className="mt-0.5 text-[11px] text-text-muted leading-relaxed">{item.description}</div>
                  </div>
                </Link>
              ))}

              {/* Dashed separator */}
              <div className="mx-3 border-border border-t border-dashed" />

              {/* Pricing */}
              <Link
                href="/pricing"
                onClick={() => setMenuOpen(false)}
                className="group flex items-start gap-3.5 border border-transparent px-3 py-3 transition-colors hover:border-border hover:border-dashed hover:bg-surface/50"
              >
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-text-muted" aria-hidden="true" />
                <div>
                  <div className="font-display text-[14px] text-text">{NAV.pricing}</div>
                  <div className="mt-0.5 text-[11px] text-text-muted leading-relaxed">Free tier and Pro plans.</div>
                </div>
              </Link>

              {/* Changelog */}
              <Link
                href="/changelog"
                onClick={() => setMenuOpen(false)}
                className="group flex items-start gap-3.5 border border-transparent px-3 py-3 transition-colors hover:border-border hover:border-dashed hover:bg-surface/50"
              >
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-text-muted" aria-hidden="true" />
                <div>
                  <div className="font-display text-[14px] text-text">{NAV.changelog}</div>
                  <div className="mt-0.5 text-[11px] text-text-muted leading-relaxed">What's new and what's next.</div>
                </div>
              </Link>
            </div>

            {/* Spacer pushes CTA to bottom */}
            <div className="flex-1" />

            {/* Download CTA */}
            <Link
              href="/#download"
              onClick={() => setMenuOpen(false)}
              className="group relative mt-8 flex items-center justify-center overflow-hidden rounded-[4px] bg-accent px-5 py-3.5 font-mono text-[12px] text-white uppercase tracking-widest shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.15),0_1px_3px_rgba(0,0,0,0.2)] transition-[background-color,box-shadow] duration-150 hover:bg-[color-mix(in_srgb,var(--color-accent)_92%,white)]"
            >
              <ButtonOverlays grainOpacity={0.14} />
              <span className="relative">{NAV.download}</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
