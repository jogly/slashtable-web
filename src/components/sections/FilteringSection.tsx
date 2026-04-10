import { FILTERING } from "../../lib/copy";
import { ContentContainer } from "../ui/ContentContainer";
import { FadeIn } from "../ui/FadeIn";

export function FilteringSection() {
  return (
    <section className="bg-surface py-24 lg:py-32" id="filters">
      <ContentContainer>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <FadeIn delay={0.12} className="order-last lg:order-first">
            <div className="border border-border bg-background p-6 lg:p-8">
              <p className="mb-4 font-mono text-[10px] text-text-muted uppercase tracking-widest">
                {FILTERING.operatorsLabel}
              </p>
              <div className="space-y-3">
                {FILTERING.operators.map((group) => (
                  <div key={group.group} className="flex items-baseline gap-3">
                    <span className="w-24 shrink-0 font-mono text-[10px] text-text-muted uppercase tracking-widest">
                      {group.group}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {group.ops.map((op) => (
                        <span
                          key={op}
                          className="rounded border border-border px-2 py-0.5 font-mono text-[10px] text-text-secondary"
                        >
                          {op}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="mb-5 flex items-center gap-2">
              <span className="h-2 w-2 shrink-0" style={{ backgroundColor: "#44ff88" }} />
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
                {FILTERING.eyebrow}
              </span>
            </div>
            <h2 className="font-display text-3xl text-text tracking-tight lg:text-4xl">{FILTERING.heading}</h2>
            <div className="mt-6 space-y-4 text-text-secondary leading-relaxed">
              <p>{FILTERING.body[0]}</p>
              <p>{FILTERING.body[1]}</p>
              <p>
                {FILTERING.body[2].split(/(in list|between)/).map((part, i) => {
                  if (part === "in list" || part === "between") {
                    return (
                      // biome-ignore lint/suspicious/noArrayIndexKey: split segments, order is stable
                      <span key={i} className="font-mono text-sm text-text">
                        {part}
                      </span>
                    );
                  }
                  // biome-ignore lint/suspicious/noArrayIndexKey: split segments, order is stable
                  return <span key={i}>{part}</span>;
                })}
              </p>
            </div>
          </FadeIn>
        </div>
      </ContentContainer>
    </section>
  );
}
