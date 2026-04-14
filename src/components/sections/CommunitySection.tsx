import { MessageCircle } from "lucide-react";
import type { ComponentProps } from "react";
import { trackExternalLinkClicked } from "../../lib/analytics";
import { COMMUNITY } from "../../lib/copy";
import { ContentContainer } from "../ui/ContentContainer";
import { FadeIn } from "../ui/FadeIn";
import { NoiseTexture } from "../ui/NoiseTexture";
import { SectionHeading } from "../ui/SectionHeading";

function XIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="X (Twitter)" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const linkMeta = [
  { icon: MessageCircle, href: "https://discord.gg/xR2VdkfnJQ", color: "#5865F2", hoverBg: "rgba(88,101,242,0.08)" },
  {
    icon: XIcon,
    href: "https://x.com/mktoast_studio",
    color: "var(--color-text)",
    hoverBg: "var(--color-surface-hover)",
  },
];

export function CommunitySection() {
  return (
    <section className="relative py-16 lg:py-24">
      <NoiseTexture
        variant="grain"
        opacity={0.35}
        className="[mask-image:linear-gradient(to_bottom,black_50%,transparent)]"
      />
      <ContentContainer className="relative">
        <FadeIn>
          <SectionHeading eyebrow={COMMUNITY.eyebrow} description={COMMUNITY.description}>
            {COMMUNITY.heading}
          </SectionHeading>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
            {COMMUNITY.links.map((link, i) => {
              const { icon: Icon, href, color, hoverBg } = linkMeta[i];
              return (
                <a
                  key={link.title}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackExternalLinkClicked({
                      url: href,
                      label: link.title,
                      source: "community_section",
                    })
                  }
                  className="group relative flex flex-col overflow-hidden border border-border bg-surface/50 p-6 transition-all duration-200 hover:border-border-strong"
                  style={{ ["--card-hover-bg" as string]: hoverBg }}
                >
                  {/* Hover glow */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}10, transparent 70%)` }}
                  />
                  <div className="relative">
                    <div className="mb-4 flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface-2 transition-colors group-hover:border-border-strong"
                        aria-hidden="true"
                      >
                        <Icon className="h-5 w-5" style={{ color }} strokeWidth={1.5} />
                      </div>
                      <h3 className="font-display text-base text-text">{link.title}</h3>
                    </div>
                    <p className="mb-5 flex-1 text-sm text-text-secondary leading-relaxed">{link.description}</p>
                    <span
                      className="font-mono text-[10px] uppercase tracking-widest transition-colors"
                      style={{ color }}
                    >
                      <span className="group-hover:underline group-hover:underline-offset-2">{link.cta}</span> &rsaquo;
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </FadeIn>
      </ContentContainer>
    </section>
  );
}
