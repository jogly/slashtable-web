import { NAVIGATION } from "../../lib/copy";
import { BreadcrumbMockup } from "../ui/BreadcrumbMockup";
import { FadeIn } from "../ui/FadeIn";
import { FeatureFrame } from "../ui/FeatureFrame";
import { NoiseTexture } from "../ui/NoiseTexture";
export function NavigationSection() {
  return (
    <section className="relative py-24 lg:py-32" id="features">
      <NoiseTexture variant="grain" opacity={0.35} />

      <div className="relative mx-auto max-w-content">
        <FadeIn>
          <FeatureFrame accentColor="#44ff88">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <div className="min-w-0">
                <div className="mb-5 flex items-center gap-2">
                  <span className="h-2 w-2 shrink-0" style={{ backgroundColor: "#44ff88" }} />
                  <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
                    {NAVIGATION.eyebrow}
                  </span>
                </div>
                <div className="mb-8 lg:hidden">
                  <BreadcrumbMockup className="w-full" />
                </div>
                <h2 className="font-display text-3xl text-text tracking-tight lg:text-4xl">{NAVIGATION.heading}</h2>
                <div className="mt-6 space-y-4 text-text-secondary leading-relaxed">
                  {NAVIGATION.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                <a
                  href="#download"
                  className="mt-8 inline-flex items-center gap-1 font-mono text-[11px] text-accent uppercase tracking-widest transition-colors hover:text-white"
                >
                  {NAVIGATION.cta} &rsaquo;
                </a>
              </div>

              <div className="hidden lg:block">
                <BreadcrumbMockup className="w-full" />
              </div>
            </div>
          </FeatureFrame>
        </FadeIn>
      </div>
    </section>
  );
}
