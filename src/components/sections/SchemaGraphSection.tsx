import { SCHEMA_GRAPH } from "../../lib/copy";
import { FadeIn } from "../ui/FadeIn";
import { FeatureFrame } from "../ui/FeatureFrame";
import { NoiseTexture } from "../ui/NoiseTexture";
import { SchemaGraphMockup } from "../ui/SchemaGraphMockup";
export function SchemaGraphSection() {
  return (
    <section className="relative py-16 lg:py-24" id="schema">
      <NoiseTexture variant="grain" opacity={0.35} />

      <div className="relative mx-auto max-w-content">
        <FadeIn>
          <FeatureFrame accentColor="#cc44ff">
            <div className="mb-8">
              <div className="mb-5 flex items-center gap-2">
                <span className="h-2 w-2 shrink-0" style={{ backgroundColor: "var(--color-magenta)" }} aria-hidden="true" />
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
                  {SCHEMA_GRAPH.eyebrow}
                </span>
              </div>
              <h2 className="font-display text-3xl text-text tracking-tight lg:text-4xl">{SCHEMA_GRAPH.heading}</h2>
              <p className="mt-4 max-w-2xl text-text-secondary leading-relaxed">{SCHEMA_GRAPH.description}</p>
            </div>

            <SchemaGraphMockup className="w-full" />

            <a
              href="#download"
              className="mt-6 inline-flex items-center gap-1 font-mono text-[11px] text-magenta uppercase tracking-widest transition-colors hover:text-white"
            >
              {SCHEMA_GRAPH.cta} &rsaquo;
            </a>
          </FeatureFrame>
        </FadeIn>
      </div>
    </section>
  );
}
