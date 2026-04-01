import { cn } from "../../lib/utils";

const columns = [
  { name: "id", type: "#", width: "w-14" },
  { name: "order_number", type: "T", width: "w-28" },
  { name: "customer_id", type: "⚿", width: "w-44", isFK: true },
  { name: "status", type: "T", width: "w-24" },
  { name: "subtotal", type: "$", width: "w-20" },
  { name: "shipping", type: "#", width: "w-20" },
  { name: "total", type: "$", width: "w-20" },
  { name: "notes", type: "T", width: "w-32" },
];

const statuses = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

const rows = Array.from({ length: 14 }, (_, i) => ({
  id: 312 + i,
  order_number: `ORD-${String(312 + i).padStart(6, "0")}`,
  customer_id: "6e0700c6-214a",
  status: statuses[i % statuses.length],
  subtotal: (49.99 + i * 12.5).toFixed(2),
  shipping: i % 3 === 0 ? "0.00" : "5.99",
  total: (49.99 + i * 12.5 + (i % 3 === 0 ? 0 : 5.99)).toFixed(2),
  notes: i % 5 === 0 ? "Rush delivery" : null,
}));

const sidebarTables = [
  { name: "analytics", count: 2 },
  { name: "internal", count: 2 },
  { name: "public", count: 13, expanded: true },
];

const publicTables = [
  "customers",
  "events",
  "invoices",
  "order_coupons",
  "order_items",
  "orders",
  "products",
];

export function AppWindowMockup({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden border border-border bg-[#1e1e1c] shadow-2xl",
        "shadow-accent-glow",
        className
      )}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-border border-b bg-[#161614] px-3 py-2.5">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="ml-4 flex gap-px">
          <div className="bg-[#2a2a26] px-3 py-1 font-mono text-[10px] text-text-muted">
            invoices
          </div>
          <div className="border-[#2a2a26] border-x border-t bg-[#1e1e1c] px-3 py-1 font-mono text-[#e8e4dc] text-[10px]">
            orders
          </div>
          <div className="flex items-center px-2 text-[10px] text-text-muted">
            +
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden w-44 shrink-0 border-border border-r bg-[#161614] sm:block">
          {/* Connections */}
          <div className="border-border border-b px-3 py-2">
            <p className="font-mono text-[9px] text-text-muted uppercase tracking-widest">
              Connections
            </p>
            <div className="mt-1.5 flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-[#44ff88]" />
              <span className="font-mono text-[10px] text-text-secondary">
                dev
              </span>
              <span className="ml-auto font-mono text-[9px] text-text-muted">
                2
              </span>
            </div>
            <div className="mt-0.5 ml-3">
              <p className="truncate font-mono text-[9px] text-text-muted">
                slashtable-dev-ecommerce
              </p>
            </div>
          </div>

          {/* Explorer */}
          <div className="px-3 py-2">
            <p className="font-mono text-[9px] text-text-muted uppercase tracking-widest">
              Explorer
            </p>
            <div className="mt-1.5 border border-border px-2 py-1">
              <span className="font-mono text-[9px] text-text-muted">
                Filter tables, views...
              </span>
            </div>
            <div className="mt-2 space-y-0.5">
              {sidebarTables.map((t) => (
                <div key={t.name}>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-text-muted">
                      {t.expanded ? "▼" : "▶"}
                    </span>
                    <span className="font-mono text-[10px] text-text-secondary">
                      {t.name}
                    </span>
                    <span className="ml-auto font-mono text-[9px] text-text-muted">
                      {t.count}
                    </span>
                  </div>
                  {t.expanded && (
                    <div className="mt-0.5 ml-3 space-y-px">
                      {publicTables.map((table) => (
                        <p
                          key={table}
                          className={cn(
                            "px-1 py-px font-mono text-[9px]",
                            table === "orders"
                              ? "bg-[#2a2a26] text-[#e8e4dc]"
                              : "text-text-muted"
                          )}
                        >
                          {table}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 overflow-x-auto border-border border-b px-3 py-1.5">
            <span className="text-[10px] text-text-muted">←</span>
            <span className="mx-0.5 text-[10px] text-text-muted">⌂</span>
            <span className="font-mono text-[10px] text-text-muted">
              orders
            </span>
            <span className="text-[10px] text-text-muted">→</span>
            <span className="font-mono text-[10px] text-accent">
              customers #6e07...
            </span>
            <span className="text-[10px] text-text-muted">→</span>
            <span className="font-mono text-[#e8e4dc] text-[10px]">
              orders
            </span>
            <span className="ml-auto whitespace-nowrap font-mono text-[9px] text-text-muted">
              312# order_items
            </span>
          </div>

          {/* Filter bar */}
          <div className="flex items-center gap-2 border-border border-b px-3 py-1">
            <span className="font-mono text-[10px] text-text-secondary">
              customer_id
            </span>
            <span className="font-mono text-[10px] text-text-muted">=</span>
            <span className="truncate font-mono text-[10px] text-text-secondary">
              6e0700c6-214a-471c-8989
            </span>
            <span className="ml-auto cursor-pointer font-mono text-[9px] text-accent">
              Clear
            </span>
          </div>

          {/* Data grid */}
          <div className="overflow-hidden">
            {/* Column headers */}
            <div className="flex border-border border-b bg-[#161614]">
              {columns.map((col) => (
                <div
                  key={col.name}
                  className={cn(
                    "shrink-0 border-border border-r px-2 py-1 font-mono text-[9px] text-text-muted",
                    col.width
                  )}
                >
                  <span className="text-text-muted/60">{col.type}</span>{" "}
                  {col.name}
                </div>
              ))}
            </div>

            {/* Rows */}
            {rows.map((row, i) => (
              <div
                key={row.id}
                className={cn(
                  "flex border-border/50 border-b",
                  i === 0 && "bg-[#2a2a26]/50"
                )}
              >
                <div className="w-14 shrink-0 border-border/50 border-r px-2 py-0.5 font-mono text-[10px] text-text-secondary">
                  {row.id}
                </div>
                <div className="w-28 shrink-0 border-border/50 border-r px-2 py-0.5 font-mono text-[10px] text-text-secondary">
                  {row.order_number}
                </div>
                <div className="w-44 shrink-0 border-border/50 border-r px-2 py-0.5 font-mono text-[10px]">
                  <span className="text-accent">
                    {row.customer_id}
                  </span>
                  <span className="ml-0.5 text-[8px] text-accent/60">→</span>
                </div>
                <div className="w-24 shrink-0 border-border/50 border-r px-2 py-0.5 font-mono text-[10px] text-text-secondary">
                  {row.status}
                </div>
                <div className="w-20 shrink-0 border-border/50 border-r px-2 py-0.5 text-right font-mono text-[10px] text-text-secondary">
                  {row.subtotal}
                </div>
                <div className="w-20 shrink-0 border-border/50 border-r px-2 py-0.5 text-right font-mono text-[10px] text-text-secondary">
                  {row.shipping}
                </div>
                <div className="w-20 shrink-0 border-border/50 border-r px-2 py-0.5 text-right font-mono text-[10px] text-text-secondary">
                  {row.total}
                </div>
                <div className="w-32 shrink-0 px-2 py-0.5 font-mono text-[10px] text-text-muted">
                  {row.notes}
                </div>
              </div>
            ))}
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between border-border border-t bg-[#161614] px-3 py-1">
            <span className="font-mono text-[9px] text-text-muted">
              slashtable-dev-ecommerce
            </span>
            <span className="font-mono text-[9px] text-text-muted">
              4ms · 100 loaded / ~2.0K total
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
