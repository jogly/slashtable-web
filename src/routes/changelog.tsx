import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import { NAME } from "../lib/constants";
import { CHANGELOG } from "../lib/copy";

const CHANGELOG_URL = "https://downloads.slashtable.dev/changelog.json";

interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  body: string;
  image: string | null;
}

function formatDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const markdownComponents: Components = {
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent underline underline-offset-2 transition-colors hover:text-text"
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-text text-xs">{children}</code>
  ),
  li: ({ children }) => (
    <li className="flex items-start gap-2.5 text-sm text-text-secondary leading-relaxed">
      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-muted" />
      <span>{children}</span>
    </li>
  ),
  p: ({ children }) => <p className="text-sm text-text-secondary leading-relaxed">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-text">{children}</strong>,
  ul: ({ children }) => <ul className="space-y-2">{children}</ul>,
};

export const Route = createFileRoute("/changelog")({
  component: ChangelogPage,
});

function ChangelogPage() {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(CHANGELOG_URL)
      .then((r) => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        setEntries(data.entries ?? []);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-narrow px-6 pt-32 pb-20">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-2 w-2 flex-shrink-0 bg-accent" />
        <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">{CHANGELOG.eyebrow}</span>
      </div>
      <h1 className="font-display text-4xl text-text tracking-tight">
        What's new in <span className="font-mono">{NAME.short}</span>
      </h1>
      <p className="mt-3 text-text-secondary leading-relaxed">{CHANGELOG.description}</p>

      <div className="mt-12 border-border border-t">
        {loading ? (
          <div className="space-y-10 py-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="flex items-baseline gap-3">
                  <div className="h-5 w-16 rounded bg-surface-2" />
                  <div className="h-3 w-24 rounded bg-surface-2" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-surface-2" />
                  <div className="h-3 w-5/6 rounded bg-surface-2" />
                  <div className="h-3 w-4/6 rounded bg-surface-2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="py-10 font-mono text-[11px] text-text-muted uppercase tracking-widest">
            Failed to load changelog.
          </p>
        ) : entries.length === 0 ? (
          <p className="py-10 font-mono text-[11px] text-text-muted uppercase tracking-widest">No entries yet.</p>
        ) : (
          entries.map((entry, i) => (
            <article
              key={entry.id}
              className={`relative py-10 ${i < entries.length - 1 ? "border-border border-b" : ""}`}
            >
              <div className="mb-4 flex flex-wrap items-baseline gap-3">
                <h2 className="font-mono font-semibold text-lg text-text tracking-tight">{entry.version}</h2>
                <time className="font-mono text-[10px] text-text-muted uppercase tracking-widest" dateTime={entry.date}>
                  {formatDate(entry.date)}
                </time>
              </div>
              {entry.image && (
                <img
                  src={entry.image}
                  alt={`Screenshot for ${entry.version}`}
                  className="mb-4 w-full rounded object-cover"
                />
              )}
              <ReactMarkdown components={markdownComponents}>{entry.body}</ReactMarkdown>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
