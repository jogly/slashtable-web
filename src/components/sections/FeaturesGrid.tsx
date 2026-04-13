import type { LucideIcon } from "lucide-react";
import {
  BarChart2,
  BookMarked,
  Clock,
  Code,
  Code2,
  Container,
  Folders,
  KeyRound,
  Layers,
  LayoutPanelTop,
  Lock,
  PenLine,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Table2,
  TerminalSquare,
  Undo2,
} from "lucide-react";
import { FEATURES_GRID } from "../../lib/copy";
import { FadeIn } from "../ui/FadeIn";
import { FeatureFrame } from "../ui/FeatureFrame";
import { NoiseTexture } from "../ui/NoiseTexture";

const featureMeta: { icon: LucideIcon; color: string }[] = [
  { icon: Code2, color: "var(--color-green)" },
  { icon: Layers, color: "var(--color-cyan)" },
  { icon: PenLine, color: "var(--color-magenta)" },
  { icon: Lock, color: "var(--color-yellow)" },
  { icon: Container, color: "var(--color-orange)" },
  { icon: KeyRound, color: "var(--color-orange)" },
  { icon: Table2, color: "var(--color-green)" },
  { icon: BookMarked, color: "var(--color-cyan)" },
  { icon: Sun, color: "var(--color-magenta)" },
  { icon: Folders, color: "var(--color-yellow)" },
  { icon: LayoutPanelTop, color: "var(--color-orange)" },
  { icon: Sparkles, color: "var(--color-cyan)" },
  { icon: TerminalSquare, color: "var(--color-magenta)" },
  { icon: Clock, color: "var(--color-yellow)" },
  { icon: BarChart2, color: "var(--color-green)" },
  { icon: SlidersHorizontal, color: "var(--color-cyan)" },
  { icon: Undo2, color: "var(--color-magenta)" },
  { icon: Code, color: "var(--color-orange)" },
];

/** Number of features shown as large hero cards */
const HERO_COUNT = 6;

export function FeaturesGrid() {
  const heroFeatures = FEATURES_GRID.features.slice(0, HERO_COUNT);
  const restFeatures = FEATURES_GRID.features.slice(HERO_COUNT);

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
              <h2 className="font-display text-3xl text-text tracking-tight lg:text-4xl">{FEATURES_GRID.heading}</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm text-text-secondary leading-relaxed">
                {FEATURES_GRID.description}
              </p>
            </div>

            {/* Hero features — larger cards with more presence */}
            <div className="grid gap-px overflow-hidden bg-border sm:grid-cols-2 lg:grid-cols-3">
              {heroFeatures.map((feature, i) => {
                const { icon: Icon, color } = featureMeta[i];
                return (
                  <FadeIn key={feature.title} delay={i * 0.04}>
                    <div className="group relative h-full bg-bg p-6 transition-colors hover:bg-surface-2/60">
                      <div
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        style={{
                          background: `radial-gradient(ellipse at 50% 0%, ${color}08, transparent 70%)`,
                        }}
                      />
                      <div className="relative">
                        <div className="mb-4 flex items-center gap-3">
                          <span
                            className="flex h-9 w-9 shrink-0 items-center justify-center border border-dashed bg-surface-2"
                            style={{ borderColor: `${color}30` }}
                            aria-hidden="true"
                          >
                            <Icon className="h-4 w-4" style={{ color }} strokeWidth={1.5} />
                          </span>
                          <h3 className="font-display text-[15px] text-text tracking-wide">{feature.title}</h3>
                        </div>
                        <p className="text-[13px] text-text-secondary leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>

            {/* Remaining features — compact two-column list */}
            <div className="mt-px grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
              {restFeatures.map((feature, i) => {
                const metaIndex = HERO_COUNT + i;
                const { icon: Icon, color } = featureMeta[metaIndex];
                return (
                  <FadeIn key={feature.title} delay={i * 0.02}>
                    <div className="group flex h-full gap-3 bg-bg p-4 transition-colors hover:bg-surface-2/60">
                      <span
                        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border border-border border-dashed bg-surface-2"
                        aria-hidden="true"
                      >
                        <Icon className="h-3 w-3" style={{ color }} strokeWidth={1.5} />
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-display text-sm text-text tracking-wide">{feature.title}</h3>
                        <p className="mt-1 text-xs text-text-muted leading-relaxed">{feature.description}</p>
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
