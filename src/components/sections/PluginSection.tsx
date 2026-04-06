import { CodeBlock } from "../ui/CodeBlock";
import { FadeIn } from "../ui/FadeIn";

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
      <div className="mx-auto max-w-content px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <FadeIn className="min-w-0">
            <CodeBlock filename="status-badge/main.ts" code={pluginExample} />
          </FadeIn>

          <FadeIn delay={0.12}>
            <div className="mb-5 flex items-center gap-2">
              <span className="h-2 w-2 shrink-0" style={{ backgroundColor: "#cc44ff" }} />
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">Plugins</span>
            </div>
            <h2 className="font-semibold text-3xl text-text tracking-tight lg:text-4xl">Shape it to your workflow.</h2>
            <div className="mt-6 space-y-4 text-text-secondary leading-relaxed">
              <p>
                Six extension points: cell renderers, record enrichers, custom views, query hooks, toolbar actions, and
                themes. Write them in TypeScript and drop them in{" "}
                <code className="font-mono text-sm text-text">~/.slashtable/plugins/</code>. No build step, no manifest
                — SlashTable picks them up on startup.
              </p>
              <p>
                Cell renderers replace how a column looks in the grid. Record enrichers fetch and attach external data
                to rows. Custom views add entirely new tab types. Query hooks intercept SQL before execution. Toolbar
                actions add buttons that access the active connection and current selection.
              </p>
              <p>
                Each plugin declares its permissions up front. There's no ambient access to the network, clipboard, or
                filesystem — only what the plugin explicitly requests. The API surface is the full contract: nothing
                else is exposed.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
