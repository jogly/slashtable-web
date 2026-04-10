import { VALUE_PILLARS } from "../../lib/copy";
import { FadeIn } from "../ui/FadeIn";
import { NoiseTexture } from "../ui/NoiseTexture";
import { SectionBorder } from "../ui/SectionBorder";

const pillarColors = ["#44ff88", "#00d4ff", "#cc44ff"];

export function ValuePillars() {
  return (
    <section className="relative bg-surface">
      <NoiseTexture variant="crosshatch" opacity={0.6} />
      <SectionBorder position="top" />
      <div className="relative mx-auto grid max-w-content divide-border sm:grid-cols-3 sm:divide-x">
        {VALUE_PILLARS.pillars.map((pillar, i) => (
          <FadeIn key={pillar.title} delay={i * 0.06}>
            <div className="px-6 py-8 lg:px-10 lg:py-10">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: pillarColors[i] }} />
                <span
                  className="font-mono text-[10px] uppercase tracking-widest"
                  style={{ color: pillarColors[i], opacity: 0.6 }}
                >
                  0{i + 1}
                </span>
              </div>
              <h3 className="mb-3 font-display text-base text-text">{pillar.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{pillar.body}</p>
            </div>
          </FadeIn>
        ))}
      </div>
      <SectionBorder position="bottom" />
    </section>
  );
}
