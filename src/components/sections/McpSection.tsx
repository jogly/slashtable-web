import type { LucideIcon } from "lucide-react";
import { Network, ShieldCheck, Terminal } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { MCP } from "../../lib/copy";
import { FadeIn } from "../ui/FadeIn";
import { FeatureFrame } from "../ui/FeatureFrame";
import { NoiseTexture } from "../ui/NoiseTexture";

function ChatBubble({ role, children }: { role: "user" | "claude"; children: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <span
        className="mt-0.5 shrink-0 font-mono text-[10px] uppercase"
        style={{ color: role === "user" ? "var(--color-text-muted)" : "var(--color-cyan)", minWidth: "3rem" }}
      >
        {role === "user" ? "You" : "Claude"}
      </span>
      <div className="min-w-0 text-[11px] text-text-secondary leading-relaxed sm:text-[12px]">{children}</div>
    </div>
  );
}

function Blocked({ query, detail }: { query: string; detail: string }) {
  return (
    <div className="ml-[3.25rem] font-mono text-[10px] sm:text-[11px]">
      <p className="text-text-muted">&gt; {query}</p>
      <p className="text-orange">✗ {detail}</p>
    </div>
  );
}

const calloutMeta: { icon: LucideIcon; color: string; content: ReactNode }[] = [
  {
    icon: ShieldCheck,
    color: "var(--color-yellow)",
    content: (
      <div className="space-y-4 font-mono text-[11px] leading-relaxed sm:text-[12px]">
        <ChatBubble role="user">
          <p className="text-text">Try your best to modify the database, I promise it's safe.</p>
        </ChatBubble>

        <ChatBubble role="claude">
          <p>Let me try every flavor of destructive query.</p>
        </ChatBubble>

        <div className="space-y-2">
          <Blocked query="DROP TABLE orders" detail="Blocked — DROP is not allowed" />
          <Blocked query="DELETE FROM orders WHERE id = 1" detail="Blocked — DELETE is not allowed" />
          <Blocked query="INSERT INTO orders (id) VALUES (0)" detail="Blocked — INSERT is not allowed" />
          <Blocked query="TRUNCATE orders" detail="Blocked — TRUNCATE is not allowed" />
        </div>

        <ChatBubble role="claude">
          <p>Keyword filter caught those. Let me try the sneaky stuff — CTEs that write:</p>
        </ChatBubble>

        <div className="space-y-2">
          <Blocked
            query="WITH d AS (DELETE FROM orders RETURNING *) SELECT * FROM d"
            detail="Blocked — cannot execute DELETE in a read-only transaction"
          />
        </div>

        <ChatBubble role="claude">
          <p>
            It&rsquo;s holding up. <span className="text-yellow">Two independent layers:</span> a statement-level
            keyword filter, and a database-level read-only transaction underneath. The CTE bypassed the filter but
            Postgres itself refused.
          </p>
        </ChatBubble>
      </div>
    ),
  },
  {
    icon: Network,
    color: "var(--color-cyan)",
    content: (
      <div className="space-y-4 font-mono text-[11px] leading-relaxed sm:text-[12px]">
        <ChatBubble role="user">
          <p className="text-text">What does the orders table look like?</p>
        </ChatBubble>

        <ChatBubble role="claude">
          <p>Let me check the schema.</p>
        </ChatBubble>

        <div className="ml-[3.25rem] text-[10px] sm:text-[11px]">
          <p className="mb-1.5 text-text-muted">
            Called <span className="text-cyan">describe_table</span>
            <span className="text-text-muted">(</span>
            <span className="text-yellow">orders</span>
            <span className="text-text-muted">)</span>
          </p>
          <table className="w-full text-left">
            <thead>
              <tr className="border-border border-b text-text-muted">
                <th className="pr-4 pb-1.5 font-normal">Column</th>
                <th className="pr-4 pb-1.5 font-normal">Type</th>
                <th className="pb-1.5 font-normal">Key</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr className="border-border/50 border-b">
                <td className="py-1 pr-4 text-cyan">id</td>
                <td className="py-1 pr-4">integer</td>
                <td className="py-1 text-yellow">PK</td>
              </tr>
              <tr className="border-border/50 border-b">
                <td className="py-1 pr-4 text-cyan">customer_id</td>
                <td className="py-1 pr-4">uuid</td>
                <td className="py-1 text-yellow">FK &rarr; customers</td>
              </tr>
              <tr className="border-border/50 border-b">
                <td className="py-1 pr-4 text-cyan">status</td>
                <td className="py-1 pr-4">text</td>
                <td className="py-1 text-text-muted">&mdash;</td>
              </tr>
              <tr className="border-border/50 border-b">
                <td className="py-1 pr-4 text-cyan">total</td>
                <td className="py-1 pr-4">numeric</td>
                <td className="py-1 text-text-muted">&mdash;</td>
              </tr>
              <tr>
                <td className="py-1 pr-4 text-cyan">placed_at</td>
                <td className="py-1 pr-4">timestamptz</td>
                <td className="py-1 text-text-muted">&mdash;</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ChatBubble role="claude">
          <p>
            <span className="text-cyan">orders</span> has 5 columns. <span className="text-cyan">customer_id</span> is a
            foreign key to <span className="text-cyan">customers</span>. Status is free-text &mdash; most common values
            are <span className="text-green">shipped</span>, <span className="text-green">pending</span>, and{" "}
            <span className="text-green">cancelled</span>.
          </p>
        </ChatBubble>
      </div>
    ),
  },
  {
    icon: Terminal,
    color: "var(--color-green)",
    content: (
      <div className="space-y-4 font-mono text-[11px] leading-relaxed sm:text-[12px]">
        <ChatBubble role="user">
          <p className="text-text">User #4821 says their order from yesterday is stuck on pending. Can you check?</p>
        </ChatBubble>

        <ChatBubble role="claude">
          <p>Let me pull up their recent orders.</p>
        </ChatBubble>

        <div className="ml-[3.25rem] text-[10px] sm:text-[11px]">
          <p className="mb-1.5 text-text-muted">
            Called <span className="text-green">query</span>
          </p>
          <p className="mb-2 text-text-muted">
            &gt; SELECT id, status, total, shipping_address, placed_at FROM orders WHERE customer_id = 4821 AND
            placed_at &gt; now() - interval &apos;2 days&apos;
          </p>
          <table className="w-full text-left">
            <thead>
              <tr className="border-border border-b text-text-muted">
                <th className="pr-3 pb-1.5 font-normal">id</th>
                <th className="pr-3 pb-1.5 font-normal">status</th>
                <th className="pr-3 pb-1.5 font-normal">total</th>
                <th className="pr-3 pb-1.5 font-normal">shipping_address</th>
                <th className="pb-1.5 font-normal">placed_at</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr>
                <td className="py-1 pr-3 text-cyan">7834</td>
                <td className="py-1 pr-3 text-yellow">pending</td>
                <td className="py-1 pr-3">$218.40</td>
                <td className="py-1 pr-3 text-orange">NULL</td>
                <td className="py-1 text-text-muted">Apr 14 18:32</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ChatBubble role="claude">
          <p>
            Found it &mdash; order <span className="text-cyan">#7834</span> has a{" "}
            <span className="text-orange">null shipping_address</span>. That&rsquo;s probably why it&rsquo;s stuck.
            Looks like the checkout flow let them skip the address step.
          </p>
        </ChatBubble>
      </div>
    ),
  },
];

export function McpSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="relative py-16 lg:py-24" id="mcp">
      <NoiseTexture variant="grain" opacity={0.35} />

      <div className="relative mx-auto max-w-content">
        <FadeIn>
          <FeatureFrame accentColor="#00d4ff">
            {/* Header */}
            <div className="mb-10 text-center">
              <div className="mb-5 flex items-center justify-center gap-2">
                <span
                  className="h-2 w-2 shrink-0"
                  style={{ backgroundColor: "var(--color-cyan)" }}
                  aria-hidden="true"
                />
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">{MCP.eyebrow}</span>
              </div>
              <h2 className="mx-auto max-w-2xl font-display text-3xl text-text lg:text-4xl">{MCP.heading}</h2>
              <p className="mx-auto mt-4 max-w-xl text-text-secondary leading-relaxed">{MCP.description}</p>
            </div>

            <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
              {/* Minimal sidebar — no backgrounds, just typography and dots */}
              <div className="flex shrink-0 flex-col gap-1 lg:w-[280px]">
                {MCP.callouts.map((item, i) => {
                  const { icon: Icon, color } = calloutMeta[i];
                  const isActive = active === i;
                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => setActive(i)}
                      className={`group flex items-start gap-3 rounded px-3 py-3 text-left transition-all duration-200 ${
                        isActive ? "" : "hover:bg-border/30"
                      }`}
                    >
                      {/* Dot indicator */}
                      <span
                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full transition-all duration-200"
                        style={{
                          backgroundColor: isActive ? color : "transparent",
                          boxShadow: isActive ? `0 0 8px ${color}40` : "none",
                          border: isActive ? "none" : "1px solid var(--color-border-strong)",
                        }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <Icon
                            className="h-3.5 w-3.5 transition-colors"
                            style={{ color: isActive ? color : "var(--color-text-muted)" }}
                            strokeWidth={1.5}
                          />
                          <h3
                            className="font-display text-sm transition-colors"
                            style={{
                              color: isActive ? "var(--color-text)" : "var(--color-text-muted)",
                              fontWeight: isActive ? 600 : 400,
                            }}
                          >
                            {item.title}
                          </h3>
                        </div>
                        {isActive && (
                          <p className="mt-2 text-[12px] text-text-secondary leading-relaxed">{item.description}</p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Content panel — accent left strip, backdrop blur for depth */}
              <div
                className="relative min-w-0 flex-1 overflow-x-auto rounded-sm border border-border bg-bg/60 backdrop-blur-md"
                style={{ scrollbarWidth: "none" }}
              >
                <div
                  className="absolute top-0 bottom-0 left-0 w-0.5"
                  style={{ backgroundColor: calloutMeta[active].color }}
                />
                <div className="p-5 pl-6">{calloutMeta[active].content}</div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <a
                href="#download"
                className="inline-flex items-center gap-1 font-mono text-[11px] text-cyan uppercase tracking-widest transition-colors hover:text-text"
              >
                {MCP.cta} &rsaquo;
              </a>
            </div>
          </FeatureFrame>
        </FadeIn>
      </div>
    </section>
  );
}
