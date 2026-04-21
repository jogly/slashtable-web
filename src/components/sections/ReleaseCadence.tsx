import { useMemo } from "react";
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

  if (!data) return null;

  const { columns, totalReleases, weekendBonus, bestWeekCount, avgPerWeek } = data;

  const maxDots = Math.max(bestWeekCount, 4);
  const DOT = 4;
  const DOT_GAP = 4;
  const COL_GAP = 6;
  const chartHeight = maxDots * (DOT + DOT_GAP);

  const dotColor = (kind: DotInfo["kind"], dim: boolean) => {
    const base =
      kind === "launch" ? "var(--color-yellow)" : kind === "weekend" ? "var(--color-magenta)" : "var(--color-text)";
    return dim ? `color-mix(in oklab, ${base} 25%, transparent)` : base;
  };

  // Tick marks for month changes
  const monthTicks: { index: number; label: string }[] = [];
  let lastMonth = -1;
  columns.forEach((col, i) => {
    const d = new Date(`${col.key}T00:00:00`);
    const m = d.getMonth();
    if (m !== lastMonth) {
      lastMonth = m;
      monthTicks.push({
        index: i,
        label: d.toLocaleDateString(undefined, { month: "short" }).toUpperCase(),
      });
    }
  });

  return (
    <section className="relative mt-12 mb-14">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 shrink-0 bg-text-muted" aria-hidden="true" />
          <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">Release cadence</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[10px] text-text-muted uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow" />
            Launch
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-magenta" />
            Weekend
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-text" />
            Weekday
          </span>
        </div>
      </div>

      <div className="relative mt-6 overflow-x-auto">
        <div
          className="relative flex items-end"
          style={{ gap: `${COL_GAP}px`, height: `${chartHeight}px`, minWidth: "max-content" }}
        >
          {columns.map((col) => (
            <div
              key={col.key}
              title={`${col.label} · ${col.dots.length} release${col.dots.length === 1 ? "" : "s"}${col.isFuture ? " (upcoming)" : ""}`}
              className="flex flex-col-reverse items-center"
              style={{ gap: `${DOT_GAP}px`, width: `${DOT}px` }}
            >
              {col.dots.length === 0 ? (
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
              ) : (
                col.dots.map((dot) => (
                  <span
                    key={dot.key}
                    className="rounded-full"
                    style={{
                      width: `${DOT}px`,
                      height: `${DOT}px`,
                      background: dotColor(dot.kind, col.isFuture),
                    }}
                  />
                ))
              )}
            </div>
          ))}
        </div>

        <div className="mt-2 h-px w-full bg-border" />

        <div className="relative mt-2" style={{ minWidth: "max-content", height: "12px" }}>
          {monthTicks.map((t) => (
            <span
              key={`tick-${t.index}`}
              className="absolute top-0 font-mono text-[9px] text-text-muted uppercase tracking-widest"
              style={{ left: `${t.index * (DOT + COL_GAP)}px` }}
            >
              {t.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[10px] text-text-muted uppercase tracking-widest">
        <Stat label="Ships" value={totalReleases.toString()} />
        <Stat label="Per week" value={avgPerWeek.toFixed(1)} />
        <Stat label="Best week" value={`×${bestWeekCount}`} tone={bestWeekCount > 1 ? "text" : "muted"} />
        <Stat label="Weekend bonus" value={weekendBonus.toString()} tone={weekendBonus > 0 ? "magenta" : "muted"} />
      </div>
    </section>
  );
}

function Stat({ label, value, tone = "text" }: { label: string; value: string; tone?: "text" | "muted" | "magenta" }) {
  const color = tone === "magenta" ? "text-magenta" : tone === "muted" ? "text-text-muted" : "text-text";
  return (
    <div className="flex items-baseline gap-2">
      <span className={`font-sans text-lg ${color}`}>{value}</span>
      <span>{label}</span>
    </div>
  );
}
