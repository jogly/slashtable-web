import { FadeIn } from "../ui/FadeIn";
import { CodeBlock } from "../ui/CodeBlock";

const mcpExample = `> list_tables
{
  "tables": [
    "customers",
    "orders",
    "order_items",
    "products"
  ]
}

> describe_table orders
{
  "columns": [
    { "name": "id",          "type": "integer", "pk": true },
    { "name": "customer_id", "type": "uuid",    "fk": "customers.id" },
    { "name": "status",      "type": "varchar", "nullable": false },
    { "name": "total",       "type": "numeric" }
  ],
  "row_count": 2048
}`;

export function McpSection() {
  return (
    <section className="bg-surface py-24 lg:py-32" id="mcp">
      <div className="mx-auto max-w-[68rem] px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <FadeIn className="min-w-0">
            <CodeBlock filename="Claude Desktop" code={mcpExample} />
          </FadeIn>

          <FadeIn delay={0.12}>
            <div className="mb-5 flex items-center gap-2">
              <span className="h-2 w-2 flex-shrink-0" style={{ backgroundColor: "#00d4ff" }} />
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
                MCP Server
              </span>
            </div>
            <h2 className="font-semibold text-3xl text-text tracking-tight lg:text-4xl">
              Your schema, visible to every AI agent.
            </h2>
            <div className="mt-6 space-y-4 text-text-secondary leading-relaxed">
              <p>
                slashtable ships with an embedded MCP server. Any MCP-compatible
                client — Claude Desktop, Claude Code, Cursor — can connect and
                query your database: list tables, describe schemas, read records,
                traverse relationships.
              </p>
              <p>
                Your AI assistant understands your data model without
                copy-pasting DDL or writing glue scripts.
              </p>
              <p className="text-sm text-text-muted">
                All queries run in read-only transactions. SQL is validated
                before execution. Configurable timeouts and row limits.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
