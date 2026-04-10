import { PLUGIN } from "../../lib/copy";
import { CodeBlock } from "../ui/CodeBlock";
import { FadeIn } from "../ui/FadeIn";
import { FeatureFrame } from "../ui/FeatureFrame";
import { NoiseTexture } from "../ui/NoiseTexture";
export function PluginSection() {
  return (
    <section className="relative py-24 lg:py-32" id="plugins">
      <NoiseTexture variant="grain" opacity={0.35} />

      <div className="relative mx-auto max-w-content">
        <FadeIn>
          <FeatureFrame accentColor="#ffcc00">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <div className="min-w-0">
                <CodeBlock filename={PLUGIN.codeFilename} code={PLUGIN.codeExample} />
              </div>

              <div>
                <div className="mb-5 flex items-center gap-2">
                  <span className="h-2 w-2 shrink-0" style={{ backgroundColor: "#ffcc00" }} />
                  <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
                    {PLUGIN.eyebrow}
                  </span>
                </div>
                <h2 className="font-display text-3xl text-text tracking-tight lg:text-4xl">{PLUGIN.heading}</h2>
                <div className="mt-6 space-y-4 text-text-secondary leading-relaxed">
                  {PLUGIN.body.map((paragraph, i) => {
                    if (i === 0) {
                      const parts = paragraph.split(PLUGIN.pluginPath);
                      return (
                        // biome-ignore lint/suspicious/noArrayIndexKey: static ordered content, index is stable
                        <p key={i}>
                          {parts[0]}
                          <code className="font-mono text-sm text-text">{PLUGIN.pluginPath}</code>
                          {parts[1]}
                        </p>
                      );
                    }
                    if (i === 1) {
                      return (
                        // biome-ignore lint/suspicious/noArrayIndexKey: static ordered content, index is stable
                        <ul key={i}>
                          {PLUGIN.body[1].split(/\.\s+/).map((item, j) => {
                            return (
                              // biome-ignore lint/suspicious/noArrayIndexKey: split sentences, index is stable
                              <li key={j} className="relative mt-2">
                                <span className="absolute -ml-6 text-text">+</span>
                                <span>{item}</span>
                              </li>
                            );
                          })}
                        </ul>
                      );
                    }
                    // biome-ignore lint/suspicious/noArrayIndexKey: static ordered content, index is stable
                    return <p key={i}>{paragraph}</p>;
                  })}
                </div>
              </div>
            </div>
          </FeatureFrame>
        </FadeIn>
      </div>
    </section>
  );
}
