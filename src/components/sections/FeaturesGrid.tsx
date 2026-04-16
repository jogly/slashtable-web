import { FEATURES_GRID } from "../../lib/copy";
import { FadeIn } from "../ui/FadeIn";
import { FeatureFrame } from "../ui/FeatureFrame";
import { NoiseTexture } from "../ui/NoiseTexture";

const featureColors: string[] = [
  "var(--color-green)",
  "var(--color-cyan)",
  "var(--color-magenta)",
  "var(--color-yellow)",
  "var(--color-orange)",
  "var(--color-orange)",
  "var(--color-green)",
  "var(--color-cyan)",
  "var(--color-magenta)",
  "var(--color-yellow)",
  "var(--color-orange)",
  "var(--color-cyan)",
  "var(--color-magenta)",
  "var(--color-yellow)",
  "var(--color-green)",
  "var(--color-cyan)",
  "var(--color-magenta)",
  "var(--color-orange)",
];

export function FeaturesGrid() {
  return (
    <section className="relative py-16 lg:py-24">
      <NoiseTexture variant="grain" opacity={0.35} />
      <div className="relative mx-auto max-w-content">
        <FadeIn>
          <FeatureFrame accentColor="#c94a00">
            <div className="mb-12 text-center">
              <div className="mb-4 flex items-center justify-center gap-2">
                <span className="h-2 w-2 shrink-0 bg-accent" aria-hidden="true" />
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
                  {FEATURES_GRID.eyebrow}
                </span>
              </div>
              <h2 className="font-display text-3xl text-text lg:text-4xl">{FEATURES_GRID.heading}</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm text-text-secondary leading-relaxed">
                {FEATURES_GRID.description}
              </p>
            </div>

            <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES_GRID.features.map((feature, i) => {
                const color = featureColors[i];
                return (
                  <FadeIn key={feature.title} delay={i * 0.015}>
                    <div className="flex items-start gap-3">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: color }}
                        aria-hidden="true"
                      />
                      <div>
                        <h3 className="font-display text-sm text-text">{feature.title}</h3>
                        <p className="mt-0.5 text-text-muted text-xs leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </FeatureFrame>
        </FadeIn>
      </div>
    </section>
  );
}
