import { GitFork, Network, ShieldCheck } from "lucide-react";
import { VALUE_PILLARS } from "../../lib/copy";
import { FadeIn } from "../ui/FadeIn";
import { NoiseTexture } from "../ui/NoiseTexture";
import { SectionBorder } from "../ui/SectionBorder";

const pillarMeta = [
  { color: "#44ff88", icon: GitFork, href: "#features" },
  { color: "#00d4ff", icon: ShieldCheck, href: "#mcp" },
  { color: "#cc44ff", icon: Network, href: "#schema" },
];

export function ValuePillars() {
  return (
    <section className="relative bg-surface">
      <NoiseTexture variant="crosshatch" opacity={0.6} />
      <SectionBorder position="top" />
      <div className="relative mx-auto grid max-w-content divide-border border-border sm:grid-cols-3 sm:divide-x min-[68rem]:border-x">
        {VALUE_PILLARS.pillars.map((pillar, i) => {
          const { color, icon: Icon, href } = pillarMeta[i];
          return (
            <FadeIn key={pillar.title} delay={i * 0.06}>
              <a
                href={href}
                className="group block h-full px-6 py-8 transition-colors hover:bg-surface-2/40 lg:px-10 lg:py-10"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center border border-dashed transition-colors"
                    style={{ borderColor: `${color}30`, backgroundColor: `${color}06` }}
                    aria-hidden="true"
                  >
                    <Icon className="h-4 w-4" style={{ color }} strokeWidth={1.5} />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color, opacity: 0.6 }}>
                    0{i + 1}
                  </span>
                </div>
                <h2 className="mb-3 font-display text-base text-text">{pillar.title}</h2>
                <p className="text-sm text-text-secondary leading-relaxed">{pillar.body}</p>
                <span
                  className="mt-4 inline-block font-mono text-[10px] uppercase tracking-widest opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ color }}
                >
                  Learn more &rsaquo;
                </span>
              </a>
            </FadeIn>
          );
        })}
      </div>
      <SectionBorder position="bottom" />
    </section>
  );
}
