import { FadeIn } from "../ui/FadeIn";

const pillars = [
  {
    title: "Click through your data",
    body: "Foreign keys render as orange links in the grid. Click a customer_id to jump to that customer's records. The breadcrumb tracks where you've been.",
  },
  {
    title: "Safe access for AI agents",
    body: "Built-in MCP server. Eight read-only tools. Keyword validation rejects mutations, a READ ONLY transaction enforces at the database level, and all queries roll back unconditionally.",
  },
  {
    title: "See your schema",
    body: "An auto-layout ER diagram of your tables and foreign keys. Pin roots, control depth, search by name.",
  },
];

export function ValuePillars() {
  return (
    <section className="border-border border-y">
      <div className="mx-auto grid max-w-[68rem] divide-border sm:grid-cols-3 sm:divide-x">
        {pillars.map((pillar, i) => (
          <FadeIn key={pillar.title} delay={i * 0.06}>
            <div className="px-6 py-8 lg:px-10 lg:py-10">
              <h3 className="mb-3 font-semibold text-base text-text">{pillar.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{pillar.body}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
