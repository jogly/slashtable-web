import changelog from "virtual:changelog";
import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { CHANGELOG } from "../lib/copy";

function formatDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Turn backtick-wrapped segments into <code> elements. */
function renderInlineCode(text: string): ReactNode[] {
  const parts = text.split(/(`[^`]+`)/);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        // biome-ignore lint/suspicious/noArrayIndexKey: split may produce duplicate empty strings
        <code key={i} className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-text text-xs">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

/** Parse a markdown-ish body (dash-prefixed lines) into bullet items. */
function parseBody(body: string): string[] {
  return body
    .split("\n")
    .map((line) => line.replace(/^-\s*/, "").trim())
    .filter(Boolean);
}

export const Route = createFileRoute("/changelog")({
  component: ChangelogPage,
});

function ChangelogPage() {
  return (
    <div className="mx-auto max-w-narrow px-6 pt-32 pb-20">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-2 w-2 flex-shrink-0 bg-accent" />
        <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">{CHANGELOG.eyebrow}</span>
      </div>
      <h1 className="font-display text-4xl text-text tracking-tight">{CHANGELOG.heading}</h1>
      <p className="mt-3 text-text-secondary leading-relaxed">{CHANGELOG.description}</p>

      <div className="mt-12 border-border border-t">
        {changelog.entries.map((entry, i) => (
          <article
            key={entry.id}
            className={`relative py-10 ${i < changelog.entries.length - 1 ? "border-border border-b" : ""}`}
          >
            {/* Version + date header */}
            <div className="mb-4 flex flex-wrap items-baseline gap-3">
              <h2 className="font-mono font-semibold text-lg text-text tracking-tight">{entry.version}</h2>
              <time className="font-mono text-[10px] text-text-muted uppercase tracking-widest" dateTime={entry.date}>
                {formatDate(entry.date)}
              </time>
            </div>

            {/* Body as bullet list */}
            <ul className="space-y-2">
              {parseBody(entry.body).map((item, j) => {
                return (
                  // biome-ignore lint/suspicious/noArrayIndexKey: parsed body items, index is stable
                  <li key={j} className="flex gap-2.5 text-sm text-text-secondary leading-relaxed">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-muted" />
                    <span>{renderInlineCode(item)}</span>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
