import { Bot, Network, Puzzle } from "lucide-react";
import { DIFFERENTIATORS } from "../../lib/copy";
import { ContentContainer } from "../ui/ContentContainer";
import { FadeIn } from "../ui/FadeIn";

const icons = [Network, Bot, Puzzle];

export function Differentiators() {
  return (
    <section className="py-section" id="features">
      <ContentContainer>
        <div className="grid gap-px bg-border sm:grid-cols-3">
          {DIFFERENTIATORS.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <FadeIn key={item.title} delay={i * 0.08}>
                <div className="bg-bg p-8 lg:p-10">
                  <Icon className="mb-5 h-6 w-6 text-accent" strokeWidth={1.5} />
                  <h3 className="font-display text-base text-text">{item.title}</h3>
                  <p className="mt-3 text-sm text-text-secondary leading-relaxed">{item.description}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </ContentContainer>
    </section>
  );
}
