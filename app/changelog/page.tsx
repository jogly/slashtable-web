import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import { ReleaseCadence } from "@/components/sections/ReleaseCadence";
import { NAME } from "@/lib/constants";
import { CHANGELOG } from "@/lib/copy";
import { formatEntryDate } from "@/lib/dates";

const CHANGELOG_URL = "https://downloads.slashtable.dev/changelog.json";

interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  body: string;
  image: string | null;
}

interface ChangelogData {
  entries: ChangelogEntry[];
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

function versionAnchor(version: string): string {
  return `v${version}`;
}

async function fetchChangelog(): Promise<ChangelogData> {
  const res = await fetch(CHANGELOG_URL);
  if (!res.ok) throw new Error(`Failed to fetch changelog: ${res.status} ${res.statusText}`);
  return res.json();
}

export default async function ChangelogPage() {
  const data = await fetchChangelog();
  const entries = data.entries ?? [];

  return (
    <div className="mx-auto max-w-narrow px-6 pt-32 pb-20">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-2 w-2 flex-shrink-0 bg-accent" />
        <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">{CHANGELOG.eyebrow}</span>
      </div>
      <h1 className="font-display text-4xl text-text">
        What's new in <span className="font-mono">{NAME.short}</span>
      </h1>
      <p className="mt-3 text-text-secondary leading-relaxed">{CHANGELOG.description}</p>

      {entries.length > 0 && <ReleaseCadence entries={entries} />}

      <div className="mt-12 border-border border-t">
        {entries.length === 0 ? (
          <p className="py-10 font-mono text-[11px] text-text-muted uppercase tracking-widest">No entries yet.</p>
        ) : (
          entries.map((entry, i) => {
            const anchor = versionAnchor(entry.version);
            return (
              <article
                key={entry.id}
                id={anchor}
                className={`relative scroll-mt-32 py-10 ${i < entries.length - 1 ? "border-border border-b" : ""}`}
              >
                <div className="mb-4 flex flex-wrap items-baseline gap-3">
                  <h2 className="font-mono font-semibold text-lg">
                    <a
                      href={`#${anchor}`}
                      className="text-text transition-colors hover:text-accent"
                      aria-label={`Link to ${entry.version}`}
                    >
                      {entry.version}
                    </a>
                  </h2>
                  <time
                    className="font-mono text-[10px] text-text-muted uppercase tracking-widest"
                    dateTime={entry.date}
                  >
                    {formatEntryDate(entry.date)}
                  </time>
                </div>
                {entry.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={entry.image}
                    alt={`Screenshot for ${entry.version}`}
                    className="mb-4 w-full rounded object-cover"
                  />
                )}
                <ReactMarkdown components={markdownComponents}>{entry.body}</ReactMarkdown>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
