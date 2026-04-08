import { useState } from "react";
import { cn } from "../../lib/utils";

// ── Layout constants (from slashtable/Breadcrumb.tsx) ──

const ARROW_W = 24;
const NARROW_ARROW_W = 16;
const ROW_H = 24;
const MID_Y = ROW_H / 2;
const STEM_X = 12;
const HEAD_X = 18;
const TIP_X = 23;
const SPREAD = 3.5;

const STROKE_ACCENT = "var(--color-accent)";
const STROKE_MUTED = "color-mix(in srgb, var(--color-text-muted) 35%, transparent)";
const pathProps = {
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 1,
};

// ── Demo tree data ──

interface GridColumn {
  name: string;
  type: string;
  /** Node ID to navigate to when this cell is clicked. */
  link?: string;
}

interface GridData {
  columns: GridColumn[];
  row: Record<string, string>;
}

interface DemoNode {
  id: string;
  label: string;
  pk?: string;
  filter?: { col: string; val: string };
  children: DemoNode[];
  grid: GridData;
}

const tree: DemoNode = {
  id: "customers",
  label: "customers",
  grid: {
    columns: [{ name: "id", type: "#" }, { name: "email", type: "✉" }, { name: "full_name", type: "T" }, { name: "orders", type: "×", link: "orders" }],
    row: { id: "14d9e...", email: "karen139@icloud.com", full_name: "Karen Jones", orders: "orders (47)" },
  },
  children: [
    {
      id: "orders",
      label: "orders",
      filter: { col: "customer_id", val: "14d9e..." },
      grid: {
        columns: [{ name: "id", type: "#" }, { name: "order_number", type: "T" }, { name: "status", type: "T" }, { name: "order_items", type: "×", link: "order_items" }],
        row: { id: "1657", order_number: "ORD-001657", status: "confirmed", order_items: "order_items (3)" },
      },
      children: [
        {
          id: "shipments",
          label: "shipments",
          filter: { col: "order_id", val: "1657" },
          grid: {
            columns: [{ name: "id", type: "#" }, { name: "carrier", type: "T" }, { name: "tracking", type: "T" }, { name: "status", type: "T" }],
            row: { id: "891", carrier: "USPS", tracking: "9400111899223...", status: "in_transit" },
          },
          children: [],
        },
        {
          id: "order_items",
          label: "order_items",
          filter: { col: "order_id", val: "1657" },
          grid: {
            columns: [{ name: "id", type: "#" }, { name: "product_id", type: "⚿", link: "products-134" }, { name: "quantity", type: "#" }, { name: "unit_price", type: "$" }],
            row: { id: "3042", product_id: "134", quantity: "2", unit_price: "24.50" },
          },
          children: [
            {
              id: "products-134",
              label: "products",
              pk: "#134",
              filter: { col: "id", val: "134" },
              grid: {
                columns: [{ name: "sku", type: "T" }, { name: "name", type: "T" }, { name: "description", type: "T" }],
                row: { sku: "SKU-00134", name: "Water Bottle v9", description: "High quality product #134." },
              },
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: "reviews",
      label: "reviews",
      filter: { col: "customer_id", val: "14d9e..." },
      grid: {
        columns: [{ name: "id", type: "#" }, { name: "product_id", type: "⚿", link: "products-142" }, { name: "rating", type: "#" }, { name: "body", type: "T" }],
        row: { id: "782", product_id: "142", rating: "4", body: "Solid build quality" },
      },
      children: [
        {
          id: "products-142",
          label: "products",
          pk: "#142",
          filter: { col: "id", val: "142" },
          grid: {
            columns: [{ name: "sku", type: "T" }, { name: "name", type: "T" }, { name: "price", type: "$" }, { name: "inventory_log", type: "×", link: "inventory_log" }],
            row: { sku: "SKU-00142", name: "Camping Stove", price: "89.00", inventory_log: "inventory_log (12)" },
          },
          children: [
            {
              id: "inventory_log",
              label: "inventory_log",
              filter: { col: "product_id", val: "142" },
              grid: {
                columns: [{ name: "id", type: "#" }, { name: "delta", type: "#" }, { name: "reason", type: "T" }, { name: "created_at", type: "⏰" }],
                row: { id: "4021", delta: "-3", reason: "Damaged in transit", created_at: "2025-12-14" },
              },
              children: [],
            },
          ],
        },
      ],
    },
  ],
};

// ── helpers ──

function findNode(node: DemoNode, id: string): DemoNode | null {
  if (node.id === id) return node;
  for (const child of node.children) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return null;
}

/** Ordered list of nodes from root to target, for the flat mobile breadcrumb. */
function activePathList(node: DemoNode, targetId: string): DemoNode[] {
  if (node.id === targetId) return [node];
  for (const child of node.children) {
    const sub = activePathList(child, targetId);
    if (sub.length > 0) return [node, ...sub];
  }
  return [];
}

function buildActivePath(node: DemoNode, targetId: string): Set<string> {
  const path = new Set<string>();
  function walk(n: DemoNode): boolean {
    if (n.id === targetId) {
      path.add(n.id);
      return true;
    }
    for (const child of n.children) {
      if (walk(child)) {
        path.add(n.id);
        return true;
      }
    }
    return false;
  }
  walk(node);
  return path;
}


// ── SVG connectors (matching slashtable source exactly) ──

function ArrowConnector({ accent }: { accent: boolean }) {
  const tip = NARROW_ARROW_W - 1;
  const head = tip - (TIP_X - HEAD_X);
  const d = [
    `M 2 ${MID_Y} L ${tip} ${MID_Y}`,
    `M ${head} ${MID_Y - SPREAD} L ${tip} ${MID_Y} L ${head} ${MID_Y + SPREAD}`,
  ].join(" ");
  return (
    <div className="shrink-0" style={{ height: ROW_H, width: NARROW_ARROW_W }}>
      <svg aria-hidden style={{ display: "block", height: ROW_H, width: NARROW_ARROW_W }} viewBox={`0 0 ${NARROW_ARROW_W} ${ROW_H}`}>
        <path d={d} {...pathProps} stroke={accent ? STROKE_ACCENT : STROKE_MUTED} />
      </svg>
    </div>
  );
}

function BranchConnector({ childCount, childOffsets, totalHeight, activeChildren }: {
  childCount: number;
  childOffsets: number[];
  totalHeight: number;
  activeChildren: boolean[];
}) {
  const r = 4;
  // inline child (index 0)
  const inlineD = [
    `M 2 ${MID_Y} L ${TIP_X} ${MID_Y}`,
    `M ${HEAD_X} ${MID_Y - SPREAD} L ${TIP_X} ${MID_Y} L ${HEAD_X} ${MID_Y + SPREAD}`,
  ].join(" ");

  const branchPaths = Array.from({ length: childCount - 1 }, (_, i) => {
    const endY = childOffsets[i + 1] + MID_Y;
    const d = [
      `M 2 ${MID_Y} L ${STEM_X - r} ${MID_Y}`,
      `Q ${STEM_X} ${MID_Y} ${STEM_X} ${MID_Y + r}`,
      `L ${STEM_X} ${endY - r}`,
      `Q ${STEM_X} ${endY} ${STEM_X + r} ${endY}`,
      `L ${TIP_X} ${endY}`,
      `M ${HEAD_X} ${endY - SPREAD} L ${TIP_X} ${endY} L ${HEAD_X} ${endY + SPREAD}`,
    ].join(" ");
    return { d, accent: activeChildren[i + 1] };
  });

  const viewBox = `0 0 ${ARROW_W} ${totalHeight}`;
  const svgStyle: React.CSSProperties = {
    display: "block", height: totalHeight, left: 0, position: "absolute", top: 0, width: ARROW_W,
  };
  return (
    <div className="shrink-0" style={{ height: totalHeight, position: "relative", width: ARROW_W }}>
      <svg aria-hidden style={svgStyle} viewBox={viewBox}>
        <path d={inlineD} {...pathProps} stroke={activeChildren[0] ? STROKE_ACCENT : STROKE_MUTED} />
      </svg>
      {branchPaths.map(({ d, accent }, i) => (
        <svg aria-hidden key={i} style={svgStyle} viewBox={viewBox}>
          <path d={d} {...pathProps} stroke={accent ? STROKE_ACCENT : STROKE_MUTED} />
        </svg>
      ))}
    </div>
  );
}

// ── Node pill ──

function Pill({ label, pk, active, accent, onClick }: {
  label: string;
  pk?: string;
  active: boolean;
  accent: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "mx-1 inline-flex items-center gap-1 whitespace-nowrap rounded border px-2 py-0.5 font-mono text-[11px] transition-colors",
        active
          ? "border-accent/30 bg-accent/15 text-accent"
          : accent
            ? "border-transparent text-accent hover:bg-accent/10"
            : "border-transparent text-text-secondary hover:bg-surface-hover",
      )}
    >
      <span>{label}</span>
      {pk && <span className="opacity-50">{pk}</span>}
      <span className={cn("ml-0.5 hidden text-[9px] sm:inline", active || accent ? "text-accent/40" : "text-text-muted/40")}>×</span>
    </button>
  );
}

// ── Recursive tree renderer ──

function rowCount(node: DemoNode): number {
  if (node.children.length === 0) return 1;
  if (node.children.length === 1) return rowCount(node.children[0]);
  return node.children.reduce((sum, c) => sum + rowCount(c), 0);
}

function TreeNode({ node, activePath, activeId, onSelect }: {
  node: DemoNode;
  activePath: Set<string>;
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const isActive = node.id === activeId;
  const isAccent = activePath.has(node.id);
  const numChildren = node.children.length;

  if (numChildren === 0) {
    return (
      <div className="flex items-start" style={{ minHeight: ROW_H }}>
        <Pill label={node.label} pk={node.pk} active={isActive} accent={isAccent} onClick={() => onSelect(node.id)} />
      </div>
    );
  }

  if (numChildren === 1) {
    const childAccent = isAccent && activePath.has(node.children[0].id);
    return (
      <div className="flex items-start" style={{ minHeight: ROW_H }}>
        <Pill label={node.label} pk={node.pk} active={isActive} accent={isAccent} onClick={() => onSelect(node.id)} />
        <ArrowConnector accent={childAccent} />
        <TreeNode node={node.children[0]} activePath={activePath} activeId={activeId} onSelect={onSelect} />
      </div>
    );
  }

  // multi-child branch
  const counts = node.children.map(rowCount);
  const offsets: number[] = [];
  let cum = 0;
  for (const c of counts) { offsets.push(cum); cum += c * ROW_H; }
  const totalH = cum;

  const activeChildren = node.children.map((c) => isAccent && activePath.has(c.id));

  return (
    <div className="flex items-start" style={{ minHeight: ROW_H }}>
      <Pill label={node.label} pk={node.pk} active={isActive} accent={isAccent} onClick={() => onSelect(node.id)} />
      <BranchConnector childCount={numChildren} childOffsets={offsets} totalHeight={totalH} activeChildren={activeChildren} />
      <div className="flex flex-col">
        {node.children.map((child) => (
          <TreeNode key={child.id} node={child} activePath={activePath} activeId={activeId} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

// ── Filter bar ──

function FilterBar({ activeNode }: { activeNode: DemoNode }) {
  const filter = activeNode.filter;
  return (
    <div className="flex h-7 items-center gap-2 overflow-hidden border-t border-border px-3 font-mono text-[10px] whitespace-nowrap">
      {/* view toggles */}
      <div className="flex items-center gap-1">
        {[
          "M1 1h4v4H1zM7 1h4v4H7zM1 7h4v4H1zM7 7h4v4H7z",
          "M1 2h10M1 6h10M1 10h10",
          "M1 1h4v10H1zM7 1h4v10H7z",
        ].map((d, i) => (
          <svg key={i} viewBox="0 0 12 12" className="h-3 w-3 text-text-muted" fill="none" stroke="currentColor" strokeWidth="1"><path d={d} /></svg>
        ))}
      </div>
      <div className="h-3 w-px bg-border" />
      {/* bookmark */}
      <svg viewBox="0 0 12 14" className="h-3 w-3 text-text-muted" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M2 1h8v12L6 10 2 13z" /></svg>

      {filter ? (
        <>
          <div className="flex items-center gap-1 rounded border border-border px-1.5 py-0.5">
            <span className="text-text-secondary">{filter.col}</span>
            <span className="text-text-muted">=</span>
            <span className="text-accent">{filter.val}</span>
            {/* lock icon */}
            <svg viewBox="0 0 10 12" className="ml-0.5 h-2.5 w-2.5 text-text-muted" fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="1" y="5" width="8" height="6" rx="1" />
              <path d="M3 5V3a2 2 0 0 1 4 0v2" />
            </svg>
          </div>
          <span className="text-text-muted">+</span>
          <span className="text-text-muted">Clear</span>
        </>
      ) : (
        <span className="text-text-muted">No active filters</span>
      )}
    </div>
  );
}

// ── Data grid ──

function DataGrid({ grid, onSelect }: { grid: GridData; onSelect: (id: string) => void }) {
  const { columns, row } = grid;
  const colTemplate = `repeat(${columns.length}, minmax(0, 1fr))`;
  return (
    <div className="border-t border-border font-mono text-[10px]">
      <div className="grid border-b border-border bg-surface" style={{ gridTemplateColumns: colTemplate }}>
        {columns.map((col, i) => (
          <div key={col.name} className={cn("truncate whitespace-nowrap px-2 py-1 text-text-muted", i < columns.length - 1 && "border-r border-border")}>
            <span className="text-text-muted/50">{col.type}</span> {col.name}
          </div>
        ))}
      </div>
      <div className="grid" style={{ gridTemplateColumns: colTemplate }}>
        {columns.map((col, i) => {
          const val = row[col.name] ?? "NULL";
          const isForwardFK = col.type === "⚿";
          const isReverseFK = col.type === "×";
          const hasLink = col.link != null;

          return (
            <div key={col.name} className={cn("truncate whitespace-nowrap px-2 py-1", i < columns.length - 1 && "border-r border-border/50", hasLink ? "text-accent" : "text-text-secondary")}>
              {hasLink ? (
                <button type="button" onClick={() => onSelect(col.link!)} className="cursor-pointer hover:underline">
                  {val}
                  {isForwardFK && <span className="ml-0.5 text-accent/50">→</span>}
                  {isReverseFK && <span className="ml-0.5 text-accent/50">›</span>}
                </button>
              ) : (
                val
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main component ──

/** Flat single-row breadcrumb for mobile: shows a fixed path, highlights the active node. */
function FlatBreadcrumb({ pathNodes, activeId, onSelect }: {
  pathNodes: DemoNode[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const activeSet = buildActivePath(tree, activeId);
  return (
    <div className="flex items-center gap-0.5 px-2 py-2" style={{ scrollbarWidth: "none" }}>
      {pathNodes.map((node, i) => {
        const isActive = node.id === activeId;
        const isOnPath = activeSet.has(node.id);
        return (
          <div key={node.id} className="flex items-center">
            {i > 0 && <ArrowConnector accent={isOnPath} />}
            <Pill label={node.label} pk={node.pk} active={isActive} accent={isOnPath} onClick={() => onSelect(node.id)} />
          </div>
        );
      })}
    </div>
  );
}

const DEFAULT_LEAF = "products-134";

export function BreadcrumbMockup({ className }: { className?: string }) {
  const [activeId, setActiveId] = useState(DEFAULT_LEAF);

  const activePath = buildActivePath(tree, activeId);
  const activeNode = findNode(tree, activeId) ?? tree;
  // Mobile: always show the full path to the default leaf so nodes don't disappear
  const mobilePathNodes = activePathList(tree, DEFAULT_LEAF);

  return (
    <div className={cn("min-w-0 overflow-hidden rounded border border-border bg-surface-2", className)}>
      {/* Desktop: full tree */}
      <div className="hidden overflow-x-auto px-2 py-2 sm:block" style={{ scrollbarWidth: "none" }}>
        <TreeNode node={tree} activePath={activePath} activeId={activeId} onSelect={setActiveId} />
      </div>
      {/* Mobile: flat path, stable nodes, moving highlight */}
      <div className="overflow-x-auto sm:hidden" style={{ scrollbarWidth: "none" }}>
        <FlatBreadcrumb pathNodes={mobilePathNodes} activeId={activeId} onSelect={setActiveId} />
      </div>
      <FilterBar activeNode={activeNode} />
      <DataGrid grid={activeNode.grid} onSelect={setActiveId} />
    </div>
  );
}
