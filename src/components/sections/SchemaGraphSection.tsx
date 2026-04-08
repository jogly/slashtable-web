import graphViewDark from "@screenshots/graph-view-dark.png";
import { FadeIn } from "../ui/FadeIn";
import { Screenshot } from "../ui/Screenshot";

export function SchemaGraphSection() {
  return (
    <section className="py-24 lg:py-32" id="schema">
      <div className="mx-auto max-w-content px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <FadeIn>
            <div className="mb-5 flex items-center gap-2">
              <span className="h-2 w-2 shrink-0" style={{ backgroundColor: "#cc44ff" }} />
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">Schema Graph</span>
            </div>
            <div className="mb-8 lg:hidden">
              <Screenshot
                src={graphViewDark}
                alt="Interactive ER diagram showing database tables connected by foreign key relationships with auto-layout and depth controls"
                className="w-full rounded-sm"
              />
            </div>
            <h2 className="font-semibold text-3xl text-text tracking-tight lg:text-4xl">
              See how your tables connect.
            </h2>
            <div className="mt-6 space-y-4 text-text-secondary leading-relaxed">
              <p>
                An interactive ER diagram that auto-layouts your entire schema. Tables arrange into a layered graph that
                minimizes edge crossings. Open it and see the shape of your data. Pan and zoom freely.
              </p>
              <p>
                Pin multiple root tables to anchor the layout. Control depth to focus on just the relationships you care
                about. Toggle column visibility per table to cut the noise. Search for a table by name and the diagram
                centers on your result.
              </p>
              <p>
                Pure join tables collapse automatically into direct many-to-many relationships. The diagram reflects
                your data model, not your implementation details.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.12} className="hidden lg:block">
            <Screenshot
              src={graphViewDark}
              alt="Interactive ER diagram showing database tables connected by foreign key relationships with auto-layout and depth controls"
              className="w-full rounded-sm"
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
