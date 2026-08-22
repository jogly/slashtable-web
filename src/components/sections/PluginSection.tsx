import { PLUGIN } from "../../lib/copy";
import { CodeBlock } from "../ui/CodeBlock";
import { FadeIn } from "../ui/FadeIn";
import { FeatureFrame } from "../ui/FeatureFrame";
import { NoiseTexture } from "../ui/NoiseTexture";
export function PluginSection({
  groupHeading,
  groupHeadingId,
}: {
  groupHeading?: string;
  groupHeadingId?: string;
} = {}) {
  const [before, after] = PLUGIN.intro.split(PLUGIN.pluginPath);
  return (
    <section
      className="relative pt-12 pb-16 lg:pt-16 lg:pb-24"
      id="plugins"
      aria-labelledby={groupHeadingId}
    >
      <NoiseTexture variant="grain" opacity={0.35} />

      <div className="relative mx-auto max-w-content">
        {groupHeading ? (
          <p className="mb-8 font-mono text-[10px] text-text-muted uppercase tracking-widest">
            {groupHeading}
          </p>
        ) : null}
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
                <h2 id={groupHeadingId} className="font-display text-3xl text-text lg:text-4xl">{PLUGIN.heading}</h2>
                <div className="mt-6 space-y-4 text-text-secondary leading-relaxed">
                  <p>
                    {before}
                    <code className="font-mono text-sm text-text">{PLUGIN.pluginPath}</code>
                    {after}
                  </p>
                  <ul className="mt-2 space-y-3">
                    {PLUGIN.capabilities.map((item) => (
                      <li key={item} className="relative pl-0">
                        <h3 className="font-display text-sm text-text">
                          <span className="mr-2 text-text" aria-hidden="true">
                            +
                          </span>
                          {item}
                        </h3>
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
