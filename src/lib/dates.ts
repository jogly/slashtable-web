const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;

export interface ParsedEntryDate {
  date: Date;
  hasTime: boolean;
  localDateKey: string;
}

function toLocalDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Parses a changelog entry timestamp that is either:
 *   - a calendar date (YYYY-MM-DD), rendered as the same calendar date in any tz, or
 *   - a full ISO string with time/zone, converted to the user's local tz.
 */
export function parseEntryDate(input: string): ParsedEntryDate {
  if (DATE_ONLY_RE.test(input)) {
    const date = new Date(`${input}T00:00:00`);
    return { date, hasTime: false, localDateKey: input };
  }
  const date = new Date(input);
  return { date, hasTime: true, localDateKey: toLocalDateKey(date) };
}

export function formatEntryDate(input: string): string {
  const { date, hasTime } = parseEntryDate(input);
  if (hasTime) {
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Journal stamp: 25 Aug 2026. Readable case, not a marketing uppercase label. */
export function formatJournalDate(input: string): string {
  const { date } = parseEntryDate(input);
  const day = date.getDate();
  const month = date.toLocaleDateString("en-GB", { month: "short" });
  return `${day} ${month} ${date.getFullYear()}`;
}
