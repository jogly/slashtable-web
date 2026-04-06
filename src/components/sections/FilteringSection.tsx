import { FadeIn } from "../ui/FadeIn";

const operators = [
  { group: "Equality", ops: ["equals", "not equals"] },
  { group: "Comparison", ops: ["greater than", "≥", "less than", "≤"] },
  { group: "Text", ops: ["contains", "starts with", "ends with", "matches regex"] },
  { group: "Range", ops: ["between", "not between"] },
  { group: "Multi-value", ops: ["in list"] },
  { group: "Null", ops: ["is null", "is not null"] },
];

export function FilteringSection() {
  return (
    <section className="bg-surface py-24 lg:py-32" id="filters">
      <div className="mx-auto max-w-content px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <FadeIn delay={0.12} className="order-last lg:order-first">
            <div className="border border-border bg-background p-6 lg:p-8">
              <p className="mb-4 font-mono text-[10px] text-text-muted uppercase tracking-widest">15 operators</p>
              <div className="space-y-3">
                {operators.map((group) => (
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
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">Filtering</span>
            </div>
            <h2 className="font-semibold text-3xl text-text tracking-tight lg:text-4xl">Filter like you mean it.</h2>
            <div className="mt-6 space-y-4 text-text-secondary leading-relaxed">
              <p>
                15 operators across six categories. Combine multiple filter blocks with AND or OR logic. Disable a block
                without deleting it — useful when you want to toggle a constraint on and off while exploring. Drop in a
                raw SQL block when the UI operators aren't enough.
              </p>
              <p>
                When you navigate into an FK relationship, the context filter locks in place — visible, labeled as
                locked, and not editable. You always know why the rows are scoped. Stack your own filters on top to keep
                narrowing.
              </p>
              <p>
                SlashTable reads column statistics and suggests operators automatically — columns with few distinct
                values get an <span className="font-mono text-sm text-text">in list</span> picker, numeric columns get{" "}
                <span className="font-mono text-sm text-text">between</span>. Dates, booleans, and enums get type-aware
                input controls.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
