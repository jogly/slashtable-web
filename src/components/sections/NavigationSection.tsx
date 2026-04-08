import { BreadcrumbMockup } from "../ui/BreadcrumbMockup";
import { FadeIn } from "../ui/FadeIn";

export function NavigationSection() {
  return (
    <section className="py-24 lg:py-32" id="features">
      <div className="mx-auto max-w-content px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <FadeIn className="min-w-0">
            <div className="mb-5 flex items-center gap-2">
              <span className="h-2 w-2 shrink-0" style={{ backgroundColor: "#44ff88" }} />
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">Navigation</span>
            </div>
            <div className="mb-8 lg:hidden">
              <BreadcrumbMockup className="w-full" />
            </div>
            <h2 className="font-semibold text-3xl text-text tracking-tight lg:text-4xl">
              Foreign keys are a navigation tree.
            </h2>
            <div className="mt-6 space-y-4 text-text-secondary leading-relaxed">
              <p>
                Click a foreign key value to drill into the related records. A breadcrumb at the top tracks your full
                path and every level is clickable.
              </p>
              <p>
                Reverse FK lookups show every record that points to the current one. Pure join tables collapse into
                direct relationships so navigation stays clean.
              </p>
              <p>Stack your own filters on top and keep drilling without losing your context.</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.12} className="hidden lg:block">
            <BreadcrumbMockup className="w-full" />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
