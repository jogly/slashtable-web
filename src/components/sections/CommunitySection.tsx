import { MessageCircle } from "lucide-react";
import type { ComponentProps } from "react";
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
  { icon: MessageCircle, href: "https://discord.gg/xR2VdkfnJQ", color: "#5865F2" },
  { icon: XIcon, href: "https://twitter.com/slashtable", color: "#1DA1F2" },
];

export function CommunitySection() {
  return (
    <section className="relative py-20 lg:py-28">
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
          <div className="mx-auto grid max-w-2xl gap-px overflow-hidden bg-border sm:grid-cols-2">
            {COMMUNITY.links.map((link, i) => {
              const { icon: Icon, href, color } = linkMeta[i];
              return (
                <a
                  key={link.title}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col bg-bg p-6 transition-colors hover:bg-surface-2/60"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded border border-border bg-surface-2">
                      <Icon className="h-4 w-4" style={{ color }} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-display text-sm text-text">{link.title}</h3>
                  </div>
                  <p className="mb-4 flex-1 text-[13px] text-text-secondary leading-relaxed">{link.description}</p>
                  <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest transition-colors group-hover:text-accent">
                    {link.cta} &rsaquo;
                  </span>
                </a>
              );
            })}
          </div>
        </FadeIn>
      </ContentContainer>
    </section>
  );
}
