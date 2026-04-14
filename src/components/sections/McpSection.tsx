import type { LucideIcon } from "lucide-react";
import { Network, ShieldCheck, Terminal } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { MCP } from "../../lib/copy";
import { FadeIn } from "../ui/FadeIn";
import { FeatureFrame } from "../ui/FeatureFrame";
import { NoiseTexture } from "../ui/NoiseTexture";

const calloutMeta: { icon: LucideIcon; color: string; content: ReactNode }[] = [
  {
    icon: ShieldCheck,
    color: "var(--color-yellow)",
    content: (
      <div className="space-y-5 font-mono text-[11px] leading-relaxed sm:text-[12px]">
        <div>
          <p className="mb-2 text-text-muted">&gt; DROP TABLE orders</p>
          <div className="border-orange border-l py-1 pl-3">
            <p className="text-orange">Blocked: DDL statement rejected</p>
            <p className="text-text-muted">Detail: DROP is not allowed</p>
          </div>
        </div>
        <div>
          <p className="mb-2 text-text-muted">&gt; DELETE FROM orders WHERE id = 1</p>
          <div className="border-orange border-l py-1 pl-3">
            <p className="text-orange">Blocked: DML mutation rejected</p>
            <p className="text-text-muted">Detail: DELETE is not allowed</p>
          </div>
        </div>
        <div className="space-y-1 pt-1 text-text-secondary">
          <p>
            <span className="text-green">&#10003;</span> SELECT * FROM orders{" "}
            <span className="text-orange">LIMIT 100</span>
            {";"}
          </p>
        </div>
      </div>
    ),
  },
  {
    icon: Network,
    color: "var(--color-cyan)",
    content: (
      <div className="space-y-4 text-[12px] leading-relaxed sm:text-[13px]">
        <div>
          <p className="mb-2 font-display text-sm text-text">
            orders <span className="font-mono text-[11px] text-text-muted">~2,000 rows</span>
          </p>
        </div>
        <table className="w-full text-left font-mono text-[11px]">
          <thead>
            <tr className="border-border border-b text-text-muted">
              <th className="pr-4 pb-1.5 font-normal">Column</th>
              <th className="pr-4 pb-1.5 font-normal">Type</th>
              <th className="pb-1.5 font-normal">Default</th>
            </tr>
          </thead>
          <tbody className="text-text-secondary">
            <tr className="border-border/50 border-b">
              <td className="py-1 pr-4 text-cyan">id</td>
              <td className="py-1 pr-4">
                integer <span className="text-text-muted">(PK)</span>
              </td>
              <td className="py-1 text-text-muted">auto</td>
            </tr>
            <tr className="border-border/50 border-b">
              <td className="py-1 pr-4 text-cyan">order_number</td>
              <td className="py-1 pr-4">
                text <span className="text-text-muted">(unique)</span>
              </td>
              <td className="py-1 text-text-muted">&mdash;</td>
            </tr>
            <tr className="border-border/50 border-b">
              <td className="py-1 pr-4 text-cyan">customer_id</td>
              <td className="py-1 pr-4">
                uuid <span className="text-text-muted">(FK)</span>
              </td>
              <td className="py-1 text-text-muted">&mdash;</td>
            </tr>
            <tr className="border-border/50 border-b">
              <td className="py-1 pr-4 text-cyan">status</td>
              <td className="py-1 pr-4">text</td>
              <td className="py-1 text-yellow">'pending'</td>
            </tr>
            <tr className="border-border/50 border-b">
              <td className="py-1 pr-4 text-cyan">total</td>
              <td className="py-1 pr-4">numeric</td>
              <td className="py-1 text-yellow">0</td>
            </tr>
            <tr className="border-border/50 border-b">
              <td className="py-1 pr-4 text-cyan">shipping_address</td>
              <td className="py-1 pr-4">jsonb</td>
              <td className="py-1 text-text-muted">&mdash;</td>
            </tr>
            <tr>
              <td className="py-1 pr-4 text-cyan">placed_at</td>
              <td className="py-1 pr-4">timestamptz</td>
              <td className="py-1 text-yellow">now()</td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
  },
  {
    icon: Terminal,
    color: "var(--color-green)",
    content: (
      <div className="space-y-5 font-mono text-[11px] leading-relaxed sm:text-[12px]">
        <div>
          <p className="mb-2 text-text-muted">&gt; SELECT status, count(*) FROM orders GROUP BY status</p>
          <table className="w-full text-left">
            <thead>
              <tr className="border-border border-b text-text-muted">
                <th className="pr-6 pb-1.5 font-normal">status</th>
                <th className="pb-1.5 text-right font-normal">count</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr className="border-border/50 border-b">
                <td className="py-1 pr-6 text-green">shipped</td>
                <td className="py-1 text-right text-yellow">1,247</td>
              </tr>
              <tr className="border-border/50 border-b">
                <td className="py-1 pr-6 text-green">pending</td>
                <td className="py-1 text-right text-yellow">84</td>
              </tr>
              <tr>
                <td className="py-1 pr-6 text-green">cancelled</td>
                <td className="py-1 text-right text-yellow">12</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <p className="mb-2 text-text-muted">
            &gt; SELECT avg(total) FROM orders WHERE placed_at &gt; now() - interval '30d'
          </p>
          <table className="w-full text-left">
            <thead>
              <tr className="border-border border-b text-text-muted">
                <th className="pb-1.5 font-normal">avg</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr>
                <td className="py-1 text-yellow">$142.38</td>
              </tr>
            </tbody>
          </table>
        </div>
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
              <h2 className="mx-auto max-w-2xl font-display text-3xl text-text tracking-tight lg:text-4xl">
                {MCP.heading}
              </h2>
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
                            className="font-display text-sm tracking-wide transition-colors"
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
