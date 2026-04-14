import { useId, useState } from "react";
import { cn } from "../../lib/utils";

/* ── Layout ── */

const VW = 820;
const VH = 250;
const TW = 190;
const HEADER_H = 28;
const ROW_H = 24;
const FOOTER_H = 18;
const ICON_S = 12;

/* ── Data ── */

interface Col {
  name: string;
  type: string;
  pk?: boolean;
  fk?: boolean;
}

interface TableDef {
  id: string;
  name: string;
  cols: Col[];
  more?: number;
  x: number;
  y: number;
}

const tableH = (t: TableDef) => HEADER_H + t.cols.length * ROW_H + (t.more ? FOOTER_H : 6);

function colCenterY(t: TableDef, colName: string) {
  const idx = t.cols.findIndex((c) => c.name === colName);
  return t.y + HEADER_H + idx * ROW_H + ROW_H / 2;
}

// Horizontal cascade: each table steps ~30px lower for natural downward flow
const tables: TableDef[] = [
  {
    id: "customers",
    name: "customers",
    cols: [
      { name: "id", type: "int4", pk: true },
      { name: "email", type: "text" },
      { name: "full_name", type: "text" },
    ],
    more: 2,
    x: 15,
    y: 20,
  },
  {
    id: "orders",
    name: "orders",
    cols: [
      { name: "id", type: "int4", pk: true },
      { name: "customer_id", type: "int4", fk: true },
      { name: "status", type: "text" },
    ],
    more: 4,
    x: 310,
    y: 50,
  },
  {
    id: "order_items",
    name: "order_items",
    cols: [
      { name: "id", type: "int4", pk: true },
      { name: "order_id", type: "int4", fk: true },
      { name: "product_id", type: "int4", fk: true },
    ],
    more: 3,
    x: 610,
    y: 80,
  },
];

// Column-level references: FK → PK
interface Ref {
  fromTable: string;
  fromCol: string;
  toTable: string;
  toCol: string;
}

const refs: Ref[] = [
  { fromTable: "orders", fromCol: "customer_id", toTable: "customers", toCol: "id" },
  { fromTable: "order_items", fromCol: "order_id", toTable: "orders", toCol: "id" },
];

const byId = Object.fromEntries(tables.map((t) => [t.id, t]));

/* ── Graph helpers ── */

function findPath(from: string, to: string): Set<string> {
  if (from === to) return new Set([from]);
  const adj: Record<string, string[]> = {};
  for (const r of refs) {
    if (!adj[r.toTable]) adj[r.toTable] = [];
    adj[r.toTable].push(r.fromTable);
    if (!adj[r.fromTable]) adj[r.fromTable] = [];
    adj[r.fromTable].push(r.toTable);
  }
  const q: string[][] = [[from]];
  const seen = new Set([from]);
  while (q.length) {
    const p = q.shift() as string[];
    for (const n of adj[p[p.length - 1]] ?? []) {
      if (n === to) return new Set([...p, n]);
      if (!seen.has(n)) {
        seen.add(n);
        q.push([...p, n]);
      }
    }
  }
  return new Set([from]);
}

/* ── Icons (lucide paths as nested SVG) ── */

function PkIcon({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <svg
      x={x}
      y={y}
      width={ICON_S}
      height={ICON_S}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Primary key"
    >
      <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
      <path d="m21 2-9.6 9.6" />
      <circle cx={7.5} cy={15.5} r={5.5} />
    </svg>
  );
}

function FkIcon({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <svg
      x={x}
      y={y}
      width={ICON_S}
      height={ICON_S}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Foreign key"
    >
      <path d="M9 17H7A5 5 0 0 1 7 7h2" />
      <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
      <line x1={8} x2={16} y1={12} y2={12} />
    </svg>
  );
}

/* ── Table card ── */

function TableCard({
  t,
  onPath,
  selected,
  onClick,
}: {
  t: TableDef;
  onPath: boolean;
  selected: boolean;
  onClick: () => void;
}) {
  const h = tableH(t);
  const level = selected ? 2 : onPath ? 1 : 0;
  const borderOpacity = [0.08, 0.14, 0.2][level];
  const nameOpacity = [0.45, 0.55, 0.65][level];
  const cardOpacity = [0.02, 0.03, 0.045][level];

  return (
    <g onClick={onClick} className="cursor-pointer">
      {/* Opaque base + tinted overlay */}
      <rect x={t.x} y={t.y} width={TW} height={h} rx={1} fill="var(--color-bg)" />
      <rect x={t.x} y={t.y} width={TW} height={h} rx={1} fill="var(--color-text)" opacity={cardOpacity} />

      {/* Border */}
      <rect
        x={t.x}
        y={t.y}
        width={TW}
        height={h}
        rx={1}
        fill="none"
        stroke="var(--color-text)"
        strokeWidth={0.5}
        opacity={borderOpacity}
      />

      {/* Header divider */}
      <line
        x1={t.x}
        y1={t.y + HEADER_H}
        x2={t.x + TW}
        y2={t.y + HEADER_H}
        stroke="var(--color-text)"
        strokeWidth={0.5}
        opacity={0.06}
      />

      {/* Table name */}
      <text
        x={t.x + 10}
        y={t.y + 18}
        fontSize={11}
        fontWeight={500}
        fontFamily="var(--font-mono)"
        fill="var(--color-text)"
        opacity={nameOpacity}
      >
        {t.name}
      </text>

      {/* Columns */}
      {t.cols.map((col, i) => {
        const rowY = t.y + HEADER_H + i * ROW_H;
        const textY = rowY + ROW_H / 2 + 4;
        const isFk = !!col.fk && !col.pk;
        return (
          <g key={col.name}>
            {col.pk && <PkIcon x={t.x + 7} y={rowY + (ROW_H - ICON_S) / 2} color="var(--color-text-muted)" />}
            {isFk && <FkIcon x={t.x + 7} y={rowY + (ROW_H - ICON_S) / 2} color="var(--color-text-muted)" />}
            <text
              x={t.x + 25}
              y={textY}
              fontSize={10.5}
              fontFamily="var(--font-mono)"
              fill="var(--color-text)"
              opacity={0.35}
            >
              {col.name}
            </text>
            <text
              x={t.x + TW - 8}
              y={textY}
              fontSize={9}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fill="var(--color-text)"
              opacity={0.15}
            >
              {col.type}
            </text>
          </g>
        );
      })}

      {/* Footer */}
      {t.more && (
        <>
          <line
            x1={t.x}
            y1={t.y + h - FOOTER_H}
            x2={t.x + TW}
            y2={t.y + h - FOOTER_H}
            stroke="var(--color-text)"
            strokeWidth={0.5}
            opacity={0.03}
          />
          <text
            x={t.x + TW / 2}
            y={t.y + h - 5}
            fontSize={8}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fill="var(--color-text-muted)"
          >
            {t.more} more
          </text>
        </>
      )}
    </g>
  );
}

/* ── Main ── */

export function SchemaGraphMockup({ className }: { className?: string }) {
  const patternId = useId();
  const [selected, setSelected] = useState("order_items");
  const ps = findPath("customers", selected);

  // Compute column-level S-curve connections (PK right edge → FK left edge)
  const edges = refs.map((r) => {
    const pkT = byId[r.toTable];
    const fkT = byId[r.fromTable];
    const sy = colCenterY(pkT, r.toCol);
    const ey = colCenterY(fkT, r.fromCol);
    const sx = pkT.x + TW;
    const ex = fkT.x;
    const mx = (sx + ex) / 2;
    const on = ps.has(r.fromTable) && ps.has(r.toTable);
    return {
      key: `${r.fromTable}.${r.fromCol}`,
      d: `M${sx},${sy} C${mx},${sy} ${mx},${ey} ${ex},${ey}`,
      on,
      sx,
      sy,
      ex,
      ey,
    };
  });

  return (
    <div className={cn("overflow-x-auto overflow-y-hidden border border-border", className)}>
      <svg aria-hidden="true" viewBox={`0 0 ${VW} ${VH}`} className="w-full min-w-[640px]">
        {/* Dark background + dot grid */}
        <defs>
          <pattern id={patternId} width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="8" r="1" fill="var(--color-text)" opacity={0.1} />
          </pattern>
        </defs>
        <rect width={VW} height={VH} fill="var(--color-bg)" />
        <rect width={VW} height={VH} fill={`url(#${patternId})`} />

        {/* Column-level connection edges */}
        {edges.map((e) => (
          <g key={e.key}>
            <path
              d={e.d}
              fill="none"
              stroke={e.on ? "var(--color-accent)" : "var(--color-border)"}
              strokeWidth={e.on ? 1.5 : 0.75}
              className="transition-all duration-300"
            />
            {/* Endpoint dots */}
            <circle
              cx={e.sx}
              cy={e.sy}
              r={2.5}
              fill={e.on ? "var(--color-accent)" : "var(--color-border)"}
              className="transition-all duration-300"
            />
            <circle
              cx={e.ex}
              cy={e.ey}
              r={2.5}
              fill={e.on ? "var(--color-accent)" : "var(--color-border)"}
              className="transition-all duration-300"
            />
          </g>
        ))}

        {/* Tables */}
        {tables.map((t) => (
          <TableCard
            key={t.id}
            t={t}
            onPath={ps.has(t.id)}
            selected={t.id === selected}
            onClick={() => setSelected(t.id)}
          />
        ))}
      </svg>
    </div>
  );
}
