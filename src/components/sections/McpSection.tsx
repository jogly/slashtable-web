import { CodeBlock } from "../ui/CodeBlock";
import { FadeIn } from "../ui/FadeIn";

const safetyExample = `> run_query "DROP TABLE orders"
{ "error": "DROP statements are not allowed" }

> run_query "DELETE FROM orders WHERE id = 1"
{ "error": "DELETE statements are not allowed" }

> run_query "SELECT * FROM orders LIMIT 2"
{
  "rows": [
    { "id": 42, "status": "shipped", "total": "149.00" },
    { "id": 43, "status": "pending", "total": "32.50" }
  ]
}`;

export function McpSection() {
  return (
    <section className="bg-surface py-24 lg:py-32" id="mcp">
      <div className="mx-auto max-w-content px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <FadeIn className="min-w-0">
            <CodeBlock filename="Claude Desktop" code={safetyExample} />
          </FadeIn>

          <FadeIn delay={0.12}>
            <div className="mb-5 flex items-center gap-2">
              <span className="h-2 w-2 shrink-0" style={{ backgroundColor: "#00d4ff" }} />
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">MCP Server</span>
            </div>
            <h2 className="font-semibold text-3xl text-text tracking-tight lg:text-4xl">
              Three layers between your AI agent and a write query.
            </h2>
            <div className="mt-6 space-y-4 text-text-secondary leading-relaxed">
              <p>
                SlashTable ships an embedded MCP server with eight read-only tools. Queries pass through keyword
                validation that rejects INSERT, UPDATE, DELETE, DROP, and other mutation statements before they reach
                Postgres. Anything that slips through hits a READ ONLY transaction that Postgres enforces at the wire
                level. The transaction rolls back unconditionally.
              </p>
              <p>All other tools use parameterized queries with bound values.</p>
              <p className="text-sm text-text-muted">
                The connection pool stays read-write so the UI can do cell edits. Read-only enforcement is per-query in
                the application layer, not at the connection level. Works with Claude Desktop, Claude Code, Cursor, and
                any MCP-compatible client.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
