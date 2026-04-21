import { useMemo, useState } from "react";
import { parseEntryDate } from "../../lib/dates";

interface ReleaseCadenceEntry {
  version: string;
  date: string;
}

interface ReleaseCadenceProps {
  entries: ReleaseCadenceEntry[];
}

interface DotInfo {
  key: string;
  kind: "launch" | "weekend" | "weekday";
  version: string;
  dateLabel: string;
}

interface WeekColumn {
  key: string;
  label: string;
  dots: DotInfo[];
  isFuture: boolean;
  isCurrent: boolean;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfWeekMonday(d: Date): Date {
  const copy = new Date(d);
  const day = copy.getDay();
  const diff = (day + 6) % 7;
  copy.setDate(copy.getDate() - diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function ReleaseCadence({ entries }: ReleaseCadenceProps) {
  const data = useMemo(() => {
    if (entries.length === 0) return null;

    const parsed = entries.map((e) => {
      const { date, localDateKey } = parseEntryDate(e.date);
      return { version: e.version, date, localDateKey };
    });
    parsed.sort((a, b) => a.date.getTime() - b.date.getTime());

    const launchVersion = parsed[0].version;
    const launchDate = new Date(parsed[0].date);
    launchDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();

    const gridStart = startOfWeekMonday(launchDate);
    const gridEnd = startOfWeekMonday(today);
    const currentWeekKey = toISODate(gridEnd);

    const columns = new Map<string, WeekColumn>();
    let cursor = new Date(gridStart);
    while (cursor.getTime() <= gridEnd.getTime()) {
      const key = toISODate(cursor);
      columns.set(key, {
        key,
        label: cursor.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        dots: [],
        isFuture: false,
        isCurrent: key === currentWeekKey,
      });
      cursor = new Date(cursor.getTime() + 7 * DAY_MS);
    }

    let totalReleases = 0;
    let weekendBonus = 0;
    let bestWeekCount = 0;

    for (const p of parsed) {
      const weekStart = startOfWeekMonday(p.date);
      const weekKey = toISODate(weekStart);
      const col = columns.get(weekKey);
      if (!col) continue;
      const day = p.date.getDay();
      const isWeekend = day === 0 || day === 6;
      const isLaunchRelease = p.version === launchVersion;
      col.dots.push({
        key: `${p.localDateKey}-${p.version}`,
        kind: isLaunchRelease ? "launch" : isWeekend ? "weekend" : "weekday",
        version: p.version,
        dateLabel: p.date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      });
      totalReleases += 1;
      if (isWeekend) weekendBonus += 1;
    }

    const columnList = [...columns.values()];
    for (const c of columnList) {
      if (c.dots.length > bestWeekCount) bestWeekCount = c.dots.length;
    }

    // Extend a little past the current week to show "upcoming" breathing room
    const futureWeeks = 3;
    for (let i = 1; i <= futureWeeks; i++) {
      const d = new Date(gridEnd.getTime() + i * 7 * DAY_MS);
      const key = toISODate(d);
      columnList.push({
        key,
        label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        dots: [],
        isFuture: d.getTime() > todayMs,
        isCurrent: false,
      });
    }

    const weeksActive = columnList.filter((c) => !c.isFuture).length;
    const avgPerWeek = weeksActive > 0 ? totalReleases / weeksActive : 0;

    return {
      columns: columnList,
      totalReleases,
      weekendBonus,
      bestWeekCount,
      avgPerWeek,
    };
  }, [entries]);

  const [pipTooltip, setPipTooltip] = useState<{ dot: DotInfo; x: number; y: number } | null>(null);

  if (!data) return null;

  const { columns, bestWeekCount } = data;

  const maxDots = Math.max(bestWeekCount, 4);
  const DOT = 4;
  const DOT_GAP = 4;
  const COL_GAP = 6;
  const CELL_W = DOT + COL_GAP;
  const CELL_H = DOT + DOT_GAP;
  const chartHeight = maxDots * CELL_H;

  const dotColor = (kind: DotInfo["kind"], dim: boolean) => {
    const base =
      kind === "launch" ? "var(--color-yellow)" : kind === "weekend" ? "var(--color-magenta)" : "var(--color-text)";
    return dim ? `color-mix(in oklab, ${base} 25%, transparent)` : base;
  };

  // Tick marks for month changes. If a boundary falls within MIN_TICK_COLS of the previous
  // label, nudge the display position forward rather than dropping the label entirely.
  const MIN_TICK_COLS = 3;
  const monthTicks: { index: number; label: string }[] = [];
  let lastMonth = -1;
  let lastDisplayedIndex = -MIN_TICK_COLS;
  columns.forEach((col, i) => {
    const d = new Date(`${col.key}T00:00:00`);
    const m = d.getMonth();
    if (m !== lastMonth) {
      lastMonth = m;
      const displayIndex = Math.max(i, lastDisplayedIndex + MIN_TICK_COLS);
      lastDisplayedIndex = displayIndex;
      monthTicks.push({
        index: displayIndex,
        label: d.toLocaleDateString(undefined, { month: "short" }).toUpperCase(),
      });
    }
  });

  return (
    <section className="relative mt-12 mb-14">
      <div className="relative overflow-x-auto overflow-y-hidden">
        <div className="relative flex items-end" style={{ height: `${chartHeight}px`, minWidth: "max-content" }}>
          {columns.map((col) => (
            <div key={col.key} className="flex flex-col-reverse" style={{ width: `${CELL_W}px` }}>
              {Array.from({ length: maxDots }).map((_, row) => {
                const dot = col.dots[row];
                const isEmptyPlaceholder = !dot && row === 0;
                return (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed row index within stable column
                    key={row}
                    className={
                      dot ? "flex cursor-default items-center justify-center" : "flex items-center justify-center"
                    }
                    style={{ width: `${CELL_W}px`, height: `${CELL_H}px` }}
                    onMouseEnter={
                      dot
                        ? (e) => {
                            const r = e.currentTarget.getBoundingClientRect();
                            setPipTooltip({
                              dot,
                              x: r.left + r.width / 2,
                              y: r.top + (r.height - DOT) / 2,
                            });
                          }
                        : undefined
                    }
                    onMouseLeave={dot ? () => setPipTooltip(null) : undefined}
                  >
                    {dot ? (
                      <span
                        className="rounded-full"
                        style={{
                          width: `${DOT}px`,
                          height: `${DOT}px`,
                          background: dotColor(dot.kind, col.isFuture),
                        }}
                      />
                    ) : isEmptyPlaceholder ? (
                      <span
                        className="rounded-full"
                        style={{
                          width: `${DOT}px`,
                          height: `${DOT}px`,
                          background: col.isFuture
                            ? "color-mix(in oklab, var(--color-text) 10%, transparent)"
                            : "color-mix(in oklab, var(--color-text) 18%, transparent)",
                        }}
                        aria-hidden="true"
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-2 h-px w-full bg-border" />

        <div className="relative mt-2" style={{ minWidth: "max-content", height: "12px" }}>
          {monthTicks.map((t) => (
            <span
              key={`tick-${t.index}`}
              className="absolute top-0 font-mono text-[9px] text-text-muted uppercase tracking-widest"
              style={{ left: `${t.index * CELL_W}px` }}
            >
              {t.label}
            </span>
          ))}
        </div>
      </div>

      {pipTooltip && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded border border-border bg-surface px-2 py-1 font-mono text-[10px] text-text shadow-md"
          style={{ left: pipTooltip.x, top: pipTooltip.y - 6 }}
        >
          {pipTooltip.dot.version}
          <span className="mx-1.5 text-text-muted">·</span>
          {pipTooltip.dot.dateLabel}
        </div>
      )}
    </section>
  );
}
