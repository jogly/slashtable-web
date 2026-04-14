import { PLUGIN } from "../../lib/copy";
import { CodeBlock } from "../ui/CodeBlock";
import { FadeIn } from "../ui/FadeIn";
import { FeatureFrame } from "../ui/FeatureFrame";
import { NoiseTexture } from "../ui/NoiseTexture";
export function PluginSection() {
  const [before, after] = PLUGIN.intro.split(PLUGIN.pluginPath);
  return (
    <section className="relative py-16 lg:py-24" id="plugins">
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
                  <span
                    className="h-2 w-2 shrink-0"
                    style={{ backgroundColor: "var(--color-yellow)" }}
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
                    {PLUGIN.eyebrow}
                  </span>
                </div>
                <h2 className="font-display text-3xl text-text tracking-tight lg:text-4xl">{PLUGIN.heading}</h2>
                <div className="mt-6 space-y-4 text-text-secondary leading-relaxed">
                  <p>
                    {before}
                    <code className="font-mono text-sm text-text">{PLUGIN.pluginPath}</code>
                    {after}
                  </p>
                  <ul>
                    {PLUGIN.capabilities.map((item) => (
                      <li key={item} className="relative mt-2">
                        <span className="absolute -ml-6 text-text" aria-hidden="true">
                          +
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </FeatureFrame>
        </FadeIn>
      </div>
    </section>
  );
}
