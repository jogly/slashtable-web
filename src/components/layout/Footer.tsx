import { Link } from "@tanstack/react-router";
import { NAME } from "../../lib/constants";
import { FOOTER } from "../../lib/copy";
import { ContentContainer } from "../ui/ContentContainer";
import { NoiseTexture } from "../ui/NoiseTexture";
import { SectionBorder } from "../ui/SectionBorder";

type FooterLink =
  | { label: string; href: string; to?: never; hash?: never }
  | { label: string; to: string; hash?: string; href?: never };

const footerRoutes: FooterLink[][] = [
  [
    { label: "", to: "/", hash: "features" },
    { label: "", to: "/", hash: "mcp" },
    { label: "", to: "/", hash: "schema" },
    { label: "", to: "/", hash: "download" },
    { label: "", to: "/pricing" },
    { label: "", to: "/changelog" },
  ],
  [
    { label: "", href: "#" },
    { label: "", href: "#" },
  ],
  [
    { label: "", href: "https://discord.gg/xR2VdkfnJQ" },
    { label: "", href: "https://twitter.com/slashtable" },
  ],
];

const footerSections = FOOTER.sections.map((section, si) => ({
  title: section.title,
  links: section.links.map((label, li) => ({
    ...footerRoutes[si][li],
    label,
  })),
}));

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-surface">
      <NoiseTexture variant="speckle" opacity={0.4} />
      <SectionBorder position="top" />
      {/* Warm accent glow at the top edge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      {/* Subtle radial warmth */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,74,0,0.04)_0%,transparent_60%)]" />

      <ContentContainer className="relative py-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <img src="/app-icon.png" alt={NAME.full} className="h-7 w-7" />
              <span className="font-mono font-semibold text-sm text-text">{NAME.short}</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-text-secondary leading-relaxed">{FOOTER.tagline}</p>
          </div>

          {footerSections.map((section, i) => (
            <div key={section.title} className={i === 0 ? "row-span-2 sm:row-span-1" : "col-start-2 sm:col-auto"}>
              <h3 className="mb-4 font-mono text-[10px] text-text-muted uppercase tracking-widest">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link
                        to={link.to}
                        hash={link.hash}
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
