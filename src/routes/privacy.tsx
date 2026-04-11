import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";

const PRIVACY_URL = "https://downloads.slashtable.dev/legal/privacy.md";

const markdownComponents: Components = {
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent underline underline-offset-2 transition-colors hover:text-white"
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-text text-xs">{children}</code>
  ),
  h1: ({ children }) => <h1 className="mt-10 mb-4 font-display text-3xl text-text tracking-tight">{children}</h1>,
  h2: ({ children }) => <h2 className="mt-8 mb-3 font-display text-xl text-text tracking-tight">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-6 mb-2 font-medium font-mono text-sm text-text">{children}</h3>,
  li: ({ children }) => (
    <li className="flex items-start gap-2.5 text-sm text-text-secondary leading-relaxed">
      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-muted" />
      <span>{children}</span>
    </li>
  ),
  p: ({ children }) => <p className="mb-4 text-sm text-text-secondary leading-relaxed">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-text">{children}</strong>,
  ul: ({ children }) => <ul className="mb-4 space-y-2">{children}</ul>,
};

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(PRIVACY_URL)
      .then((r) => {
        if (!r.ok) throw new Error(r.statusText);
        return r.text();
      })
      .then((text) => {
        if (cancelled) return;
        setBody(text);
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
        <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">Legal</span>
      </div>
      <h1 className="font-display text-4xl text-text tracking-tight">Privacy Policy</h1>

      <div className="mt-12 border-border border-t pt-10">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-3/4 rounded bg-surface-2" />
            <div className="h-4 w-full rounded bg-surface-2" />
            <div className="h-4 w-5/6 rounded bg-surface-2" />
            <div className="h-4 w-2/3 rounded bg-surface-2" />
          </div>
        ) : error ? (
          <p className="font-mono text-[11px] text-text-muted uppercase tracking-widest">
            Failed to load privacy policy.
          </p>
        ) : (
          <ReactMarkdown components={markdownComponents}>{body}</ReactMarkdown>
        )}
      </div>
    </div>
  );
}
