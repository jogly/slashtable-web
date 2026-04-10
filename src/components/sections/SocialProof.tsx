import { SOCIAL_PROOF } from "../../lib/copy";
import { ContentContainer } from "../ui/ContentContainer";
import { FadeIn } from "../ui/FadeIn";
import { NoiseTexture } from "../ui/NoiseTexture";
import { SectionBorder } from "../ui/SectionBorder";

export function SocialProof() {
  return (
    <section className="relative bg-surface py-16 lg:py-20">
      <NoiseTexture variant="speckle" opacity={0.5} />
      <SectionBorder position="top" />
      <ContentContainer className="relative">
        <FadeIn>
          <p className="mb-10 text-center font-mono text-[10px] text-text-muted uppercase tracking-widest">
            {SOCIAL_PROOF.heading}
          </p>
        </FadeIn>

        <FadeIn delay={0.06}>
          <div className="grid gap-px overflow-hidden bg-border sm:grid-cols-3">
            {SOCIAL_PROOF.testimonials.map((t) => (
              <blockquote key={t.name} className="flex h-full flex-col bg-bg p-6">
                <p className="flex-1 text-sm text-text-secondary italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-5 flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 font-mono text-text-muted text-xs">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-text text-xs">{t.name}</p>
                    <p className="truncate font-mono text-[10px] text-text-muted">
                      {t.role} &middot; {t.company}
                    </p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </FadeIn>
      </ContentContainer>
    </section>
  );
}
