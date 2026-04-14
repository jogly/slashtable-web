import { Link } from "@tanstack/react-router";
import logoImg from "../../assets/app-icon.png?as=img";
import { NAME } from "../../lib/constants";
import { FOOTER } from "../../lib/copy";
import { ContentContainer } from "../ui/ContentContainer";
import { Img } from "../ui/Img";
import { NoiseTexture } from "../ui/NoiseTexture";
import { SectionBorder } from "../ui/SectionBorder";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-surface">
      <NoiseTexture variant="speckle" opacity={0.4} />
      <SectionBorder position="top" />
      {/* Warm accent glow at the top edge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      {/* Subtle radial warmth */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,var(--color-glow-soft)_0%,transparent_60%)]" />

      <ContentContainer className="relative py-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 md:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-4 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <Img image={logoImg} className="h-7 w-7" />
              <span className="font-mono font-semibold text-sm text-text">{NAME.short}</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-text-secondary leading-relaxed">{FOOTER.tagline}</p>
          </div>

          {FOOTER.sections.map((section, _i) => (
            <div key={section.title} className="col-span-1 md:col-span-1">
              <h3 className="mb-4 font-mono text-[10px] text-text-muted uppercase tracking-widest">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {"to" in link ? (
                      <Link
                        to={link.to}
                        hash={"hash" in link ? link.hash : undefined}
                        className="text-sm text-text-secondary transition-colors hover:text-text"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className="text-sm text-text-secondary transition-colors hover:text-text">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-border/30 border-t pt-6 sm:flex-row">
          <p className="font-mono text-text-muted text-xs">
            &copy; {new Date().getFullYear()} {FOOTER.copyright}
          </p>
          <p className="font-mono text-text-muted text-xs">
            Built with{" "}
            <a href="https://tauri.app" className="underline underline-offset-2 transition-colors hover:text-text">
              Tauri
            </a>
            ,{" "}
            <a href="https://react.dev" className="underline underline-offset-2 transition-colors hover:text-text">
              React
            </a>
            .
          </p>
        </div>
      </ContentContainer>
    </footer>
  );
}
