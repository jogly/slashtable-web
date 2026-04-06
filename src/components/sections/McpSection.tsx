import { CodeBlock } from "../ui/CodeBlock";
import { FadeIn } from "../ui/FadeIn";

const mcpExample = `> list_tables
{ "tables": ["customers", "orders", "order_items", "products"] }

> describe_table orders
{
  "columns": [
    { "name": "id",          "type": "integer", "pk": true },
    { "name": "customer_id", "type": "uuid",    "fk": "customers.id" },
    { "name": "status",      "type": "varchar", "nullable": false },
    { "name": "total",       "type": "numeric" }
  ]
}

> get_related_records
{
  "table": "orders", "via": "customers.id → customers",
  "records": [
    { "id": 42, "status": "shipped", "total": "149.00" },
    { "id": 43, "status": "pending", "total": "32.50"  }
  ]
}`;

export function McpSection() {
  return (
    <section className="bg-surface py-24 lg:py-32" id="mcp">
      <div className="mx-auto max-w-content px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <FadeIn className="min-w-0">
            <CodeBlock filename="Claude Desktop" code={mcpExample} />
          </FadeIn>

          <FadeIn delay={0.12}>
            <div className="mb-5 flex items-center gap-2">
              <span className="h-2 w-2 shrink-0" style={{ backgroundColor: "#00d4ff" }} />
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">MCP Server</span>
            </div>
            <h2 className="font-semibold text-3xl text-text tracking-tight lg:text-4xl">
              Give your AI agent a live connection to your database.
            </h2>
            <div className="mt-6 space-y-4 text-text-secondary leading-relaxed">
              <p>
                SlashTable includes an embedded MCP server — no extra setup, no config files. Any MCP-compatible client
                connects and gets eight tools: list tables, describe schemas, fetch records, get a single row by primary
                key, traverse FK relationships, retrieve the full schema graph, and run SELECT queries.
              </p>
              <p>
                Your AI agent gets a complete picture of your data model from inside your database client. It can answer
                questions about your data, write accurate queries, and follow foreign key paths — without you
                copy-pasting DDL or writing glue scripts.
              </p>
              <p className="text-sm text-text-muted">
                All eight tools are read-only. Query text is validated before execution, mutation keywords trigger a
                secondary scan, and a final transaction-level check catches anything that slips through. Your data stays
                safe.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
