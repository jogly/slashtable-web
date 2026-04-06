import breadcrumbNavDark from "@screenshots/breadcrumb-nav-dark.png";
import { FadeIn } from "../ui/FadeIn";
import { Screenshot } from "../ui/Screenshot";

export function NavigationSection() {
  return (
    <section className="py-24 lg:py-32" id="features">
      <div className="mx-auto max-w-content px-6">
        {/* FK navigation — copy left, screenshot right */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <FadeIn>
            <div className="mb-5 flex items-center gap-2">
              <span className="h-2 w-2 shrink-0" style={{ backgroundColor: "#44ff88" }} />
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">Navigation</span>
            </div>
            <div className="mb-8 lg:hidden">
              <Screenshot
                src={breadcrumbNavDark}
                alt="Breadcrumb navigation bar showing connection › schema › table hierarchy with a data grid and foreign key links highlighted"
                className="w-full rounded-sm"
              />
            </div>
            <h2 className="font-semibold text-3xl text-text tracking-tight lg:text-4xl">
              Your foreign keys are a navigation tree.
            </h2>
            <div className="mt-6 space-y-4 text-text-secondary leading-relaxed">
              <p>
                Click a foreign key value to drill into the related records. A breadcrumb at the top tracks your full
                path and every level is clickable. Each tab keeps its own position in the tree independently.
              </p>
              <p>
                Reverse FK lookups show every record that points to the current one. SlashTable auto-detects pure join
                tables — exactly two foreign keys, no other columns — and collapses them into direct relationships so
                navigation stays clean.
              </p>
              <p>
                When you navigate into an FK relationship, the context filter locks in place. You can see it, but you
                can't clear it by accident. Stack your own filters on top and keep drilling without losing your context.
                Alt+Click opens a split pane to compare data across tables side by side.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.12} className="hidden lg:block">
            <Screenshot
              src={breadcrumbNavDark}
              alt="Breadcrumb navigation bar showing connection › schema › table hierarchy with a data grid and foreign key links highlighted"
              className="w-full rounded-sm"
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
