import { FadeIn } from "../ui/FadeIn";
import { CodeBlock } from "../ui/CodeBlock";

const pluginExample = `import { Plugin } from "slashtable";

export default class StatusBadge extends Plugin {
  onload() {
    this.registerCellRenderer({
      column: "status",
      render(value, el) {
        const colors = {
          confirmed: "#44ff88",
          pending:   "#ffcc00",
          shipped:   "#00d4ff",
          cancelled: "#ff5555",
        };
        el.style.color = colors[value] ?? "#6b6860";
        el.textContent = value;
      },
    });
  }
}`;

export function PluginSection() {
  return (
    <section className="bg-surface py-24 lg:py-32" id="plugins">
      <div className="mx-auto max-w-[68rem] px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <FadeIn>
            <CodeBlock filename="status-badge/main.ts" code={pluginExample} />
          </FadeIn>

          <FadeIn delay={0.12}>
            <div className="flex items-center gap-2 mb-5">
              <span className="h-2 w-2 flex-shrink-0" style={{ backgroundColor: "#cc44ff" }} />
              <span className="font-mono text-[10px] tracking-widest uppercase text-text-muted">
                Plugins
              </span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-text lg:text-4xl">
              Shape it to your workflow.
            </h2>
            <div className="mt-6 space-y-4 text-text-secondary leading-relaxed">
              <p>
                Six extension points: cell renderers, record enrichers, custom
                views, query hooks, toolbar actions, and themes. Write them in
                TypeScript, drop them in{" "}
                <code className="font-mono text-sm text-text">
                  ~/.slashtable/plugins/
                </code>
                .
              </p>
              <p>
                Plugins declare permissions up front. No ambient access to
                network, clipboard, or filesystem without declaration.
              </p>
              <p className="text-sm text-text-muted">
                Community plugin marketplace is planned.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
