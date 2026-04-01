import { FadeIn } from "../ui/FadeIn";
import {
  Table2,
  Code2,
  GitGraph,
  Layers,
  Container,
  ShieldCheck,
  Link2,
  Search,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const features: {
  icon: LucideIcon;
  color: string;
  title: string;
  description: string;
}[] = [
  {
    icon: Link2,
    color: "#44ff88",
    title: "Relationship navigation",
    description:
      "Foreign keys are clickable links. Join tables detected and collapsed into direct M2M relationships automatically.",
  },
  {
    icon: Code2,
    color: "#00d4ff",
    title: "SQL editor",
    description:
      "Monaco-based editor with schema-aware autocomplete, query history, and inline results.",
  },
  {
    icon: GitGraph,
    color: "#cc44ff",
    title: "Schema graph",
    description:
      "Interactive visualization of your tables and foreign key relationships.",
  },
  {
    icon: Layers,
    color: "#ffcc00",
    title: "Multi-connection",
    description:
      "Connect to multiple databases. Organize connections into folders with custom icons.",
  },
  {
    icon: Container,
    color: "#c94a00",
    title: "Docker detection",
    description:
      "Auto-discovers Postgres containers running on your machine. One click to connect.",
  },
  {
    icon: ShieldCheck,
    color: "#44ff88",
    title: "Read-only safety",
    description:
      "MCP queries run in read-only transactions. Validated server-side. No accidental mutations.",
  },
  {
    icon: Table2,
    color: "#00d4ff",
    title: "Virtual-scrolling grid",
    description:
      "Handles thousands of rows without lag. Sortable, filterable, with type-aware rendering.",
  },
  {
    icon: Search,
    color: "#ffcc00",
    title: "Command palette",
    description:
      "⌘P to fuzzy-search across tables, connections, actions, and navigation history.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-[68rem] px-6">
        <div className="mb-16 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="h-2 w-2 flex-shrink-0" style={{ backgroundColor: "#ffcc00" }} />
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
              Features
            </span>
          </div>
          <h2 className="font-semibold text-3xl text-text tracking-tight lg:text-4xl">
            Everything else you need.
          </h2>
        </div>

        <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 0.04}>
              <div>
                <div className="mb-2.5 flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 flex-shrink-0"
                    style={{ backgroundColor: feature.color }}
                  />
                  <h3 className="font-semibold text-sm text-text">
                    {feature.title}
                  </h3>
                </div>
                <p className="pl-3.5 text-sm text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
