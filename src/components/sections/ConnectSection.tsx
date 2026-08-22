import { Cable, Container, GitBranch, KeyRound, Layers, Terminal } from "lucide-react";
import { CONNECT } from "../../lib/copy";
import { FadeIn } from "../ui/FadeIn";
import { FeatureFrame } from "../ui/FeatureFrame";
import { NoiseTexture } from "../ui/NoiseTexture";

const itemMeta = [
  { icon: Container, color: "var(--color-cyan)" },
  { icon: GitBranch, color: "var(--color-green)" },
  { icon: Layers, color: "var(--color-magenta)" },
  { icon: Cable, color: "var(--color-yellow)" },
  { icon: Terminal, color: "var(--color-orange)" },
  { icon: KeyRound, color: "var(--color-cyan)" },
];

export function ConnectSection({
  groupHeading,
  groupHeadingId,
}: {
  groupHeading?: string;
  groupHeadingId?: string;
} = {}) {
  return (
    <section
      className="relative pt-12 pb-16 lg:pt-16 lg:pb-24"
      id="connect"
      aria-labelledby={groupHeadingId}
    >
      <NoiseTexture variant="grain" opacity={0.35} />

      <div className="relative mx-auto max-w-content">
        {groupHeading && groupHeadingId ? (
          <h2
            id={groupHeadingId}
            className="mb-8 font-mono text-[10px] text-text-muted uppercase tracking-widest"
          >
            {groupHeading}
          </h2>
        ) : null}
        <FadeIn>
          <FeatureFrame accentColor="#00d4ff">
            <div className="mb-10 max-w-2xl">
              <div className="mb-5 flex items-center gap-2">
                <span
                  className="h-2 w-2 shrink-0"
                  style={{ backgroundColor: "var(--color-cyan)" }}
                  aria-hidden="true"
                />
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
                  {CONNECT.eyebrow}
                </span>
              </div>
              <h3 className="font-display text-3xl text-text lg:text-4xl">{CONNECT.heading}</h3>
              <p className="mt-4 text-text-secondary leading-relaxed">{CONNECT.description}</p>
            </div>

            <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {CONNECT.items.map((item, i) => {
                const { icon: Icon, color } = itemMeta[i];
                return (
                  <FadeIn key={item.title} delay={i * 0.04}>
                    <div className="flex items-start gap-3">
                      <span
                        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border border-dashed"
                        style={{ borderColor: `${color}40`, backgroundColor: `${color}08` }}
                        aria-hidden="true"
                      >
                        <Icon className="h-3.5 w-3.5" style={{ color }} strokeWidth={1.5} />
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-display text-sm text-text">{item.title}</h3>
                        <p className="mt-1 text-sm text-text-secondary leading-relaxed">{item.body}</p>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>

            <a
              href="#download"
              className="mt-10 inline-flex items-center gap-1 font-mono text-[11px] text-cyan uppercase tracking-widest transition-colors hover:text-text"
            >
              {CONNECT.cta} &rsaquo;
            </a>
          </FeatureFrame>
        </FadeIn>
      </div>
    </section>
  );
}
