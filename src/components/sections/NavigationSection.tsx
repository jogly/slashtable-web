import { FadeIn } from "../ui/FadeIn";

const shortcuts = [
  { keys: ["⌘", "P"], label: "Command palette" },
  { keys: ["⌘", "["], label: "Go back" },
  { keys: ["⌘", "]"], label: "Go forward" },
  { keys: ["j", "k"], label: "Move through rows" },
  { keys: ["/"], label: "Search in grid" },
  { keys: ["⌘", "T"], label: "New tab" },
  { keys: ["⌥", "Click"], label: "Split pane" },
];

export function NavigationSection() {
  return (
    <section className="py-24 lg:py-32" id="features">
      <div className="mx-auto max-w-[68rem] px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <FadeIn>
            <div className="mb-5 flex items-center gap-2">
              <span className="h-2 w-2 flex-shrink-0" style={{ backgroundColor: "#44ff88" }} />
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
                Navigation
              </span>
            </div>
            <h2 className="font-semibold text-3xl text-text tracking-tight lg:text-4xl">
              Explore your database like you browse the web.
            </h2>
            <div className="mt-6 space-y-4 text-text-secondary leading-relaxed">
              <p>
                Each tab has its own navigation history. Click into a foreign key,
                go deeper, press{" "}
                <span className="font-mono text-sm text-text">⌘[</span> to go back.
                Alt+Click opens a split pane.
              </p>
              <p>
                Vim bindings in the data grid. Command palette over everything.
                Every action reachable from the keyboard.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.12}>
            <div className="border border-border bg-surface p-6 lg:p-8">
              <div className="space-y-3">
                {shortcuts.map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">{s.label}</span>
                    <div className="flex items-center gap-1">
                      {s.keys.map((key, i) => (
                        <kbd
                          key={i}
                          className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded border border-border-strong px-1.5 font-mono text-[10px] text-text-muted"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
