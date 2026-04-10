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

export function FeaturesGrid() {
  return (
    <section className="relative py-24 lg:py-32">
      <NoiseTexture variant="grain" opacity={0.35} />
      <div className="relative mx-auto max-w-content">
        <FadeIn>
          <FeatureFrame accentColor="#c94a00">
            <div className="mb-12 text-center">
              <div className="mb-4 flex items-center justify-center gap-2">
                <span className="h-2 w-2 shrink-0 bg-accent" />
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
                  {FEATURES_GRID.eyebrow}
                </span>
              </div>
              <h2 className="font-display text-3xl text-text tracking-tight lg:text-4xl">{FEATURES_GRID.heading}</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm text-text-secondary leading-relaxed">
                {FEATURES_GRID.description}
              </p>
            </div>

            <div className="grid gap-px overflow-hidden bg-border sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES_GRID.features.map((feature, i) => {
                const { icon: Icon, color } = featureMeta[i];
                return (
                  <FadeIn key={feature.title} delay={i * 0.03}>
                    <div className="group h-full bg-bg p-5 transition-colors hover:bg-surface-2/60">
                      <div className="mb-3 flex items-center gap-2.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-border border-dashed bg-surface-2">
                          <Icon className="h-3.5 w-3.5" style={{ color }} strokeWidth={1.5} />
                        </span>
                        <h3 className="font-display text-sm text-text tracking-wide">{feature.title}</h3>
                      </div>
                      <p className="text-[13px] text-text-secondary leading-relaxed">{feature.description}</p>
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
