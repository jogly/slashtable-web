import { FadeIn } from "../ui/FadeIn";
import { Network, Bot, Puzzle } from "lucide-react";

const items = [
  {
    icon: Network,
    title: "Schema-aware navigation",
    description:
      "Foreign keys render as links. Click a customer_id, land on the customer. Join tables are detected automatically and collapsed into direct relationships.",
  },
  {
    icon: Bot,
    title: "Built for AI agents",
    description:
      "Ships with an MCP server. Claude, Cursor, or any MCP client can query your schema and read your data. Read-only by default.",
  },
  {
    icon: Puzzle,
    title: "Extend everything",
    description:
      "Obsidian-style plugin system. Write cell renderers, custom views, data enrichers, query hooks, and themes in TypeScript.",
  },
];

export function Differentiators() {
  return (
    <section className="py-section" id="features">
      <div className="mx-auto max-w-content px-6">
        <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
          {items.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.08}>
              <div className="bg-bg p-8 lg:p-10">
                <item.icon
                  className="mb-5 h-6 w-6 text-accent"
                  strokeWidth={1.5}
                />
                <h3 className="text-base font-semibold text-text">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
