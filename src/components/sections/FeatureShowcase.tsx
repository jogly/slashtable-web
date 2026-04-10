import breadcrumbNav from "@screenshots/breadcrumb-nav-dark.png";
import commandPalette from "@screenshots/command-palette.png";
import graphView from "@screenshots/graph-view-dark.png";
import heroDark from "@screenshots/hero-dark.png";
import { FEATURE_SHOWCASE } from "../../lib/copy";
import { ContentContainer } from "../ui/ContentContainer";
import { FadeIn } from "../ui/FadeIn";
import { Screenshot } from "../ui/Screenshot";

const featureImages = [heroDark, graphView, commandPalette, breadcrumbNav, heroDark, breadcrumbNav];
const featureColors = ["#44ff88", "#cc44ff", "#ffcc00", "#00d4ff", "#c94a00", "#44ff88"];

export function FeatureShowcase() {
  return (
    <section className="border-border/50 border-y bg-surface-2 py-24 lg:py-32">
      <ContentContainer>
        <FadeIn>
          <div className="mb-16 text-center">
            <p className="mb-3 font-mono text-accent text-xs uppercase tracking-widest">{FEATURE_SHOWCASE.eyebrow}</p>
            <h2 className="font-display text-3xl text-text tracking-tight lg:text-4xl">
              {FEATURE_SHOWCASE.heading}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-text-secondary leading-relaxed">
              {FEATURE_SHOWCASE.description}
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURE_SHOWCASE.features.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 0.06}>
              <div className="group overflow-hidden rounded-sm border border-border bg-bg transition-colors hover:border-border-strong">
                {/* Screenshot thumbnail */}
                <div className="relative aspect-[16/10] overflow-hidden border-border border-b bg-surface">
                  <Screenshot
                    src={featureImages[i]}
                    alt={feature.title}
                    className="h-full w-full object-cover object-left-top opacity-70 transition-opacity group-hover:opacity-90"
                  />
                  {/* Gradient overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent" />
                </div>
                {/* Text */}
                <div className="p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: featureColors[i] }} />
                    <h3 className="font-display text-sm text-text">{feature.title}</h3>
                  </div>
                  <p className="text-[13px] text-text-secondary leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </ContentContainer>
    </section>
  );
}
