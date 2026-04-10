import type { LucideIcon } from "lucide-react";
import {
  BarChart2,
  BookMarked,
  Clock,
  Code2,
  Code,
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
  { icon: Code2, color: "#44ff88" },
  { icon: Layers, color: "#00d4ff" },
  { icon: PenLine, color: "#cc44ff" },
  { icon: Lock, color: "#ffcc00" },
  { icon: Container, color: "#c94a00" },
  { icon: KeyRound, color: "#c94a00" },
  { icon: Table2, color: "#44ff88" },
  { icon: BookMarked, color: "#00d4ff" },
  { icon: Sun, color: "#cc44ff" },
  { icon: Folders, color: "#ffcc00" },
  { icon: LayoutPanelTop, color: "#c94a00" },
  { icon: Sparkles, color: "#00d4ff" },
  { icon: TerminalSquare, color: "#cc44ff" },
  { icon: Clock, color: "#ffcc00" },
  { icon: BarChart2, color: "#44ff88" },
  { icon: SlidersHorizontal, color: "#00d4ff" },
  { icon: Undo2, color: "#cc44ff" },
  { icon: Code, color: "#c94a00" },
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
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-dashed border-border bg-surface-2">
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
