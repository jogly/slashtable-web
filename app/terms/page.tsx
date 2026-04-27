import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";

const TERMS_URL = "https://downloads.slashtable.dev/legal/terms.md";

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
  h1: ({ children }) => <h1 className="mt-10 mb-4 font-display text-3xl text-text">{children}</h1>,
  h2: ({ children }) => <h2 className="mt-8 mb-3 font-display text-text text-xl">{children}</h2>,
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

async function fetchTerms(): Promise<string> {
  const res = await fetch(TERMS_URL);
  if (!res.ok) throw new Error(`Failed to fetch terms: ${res.status} ${res.statusText}`);
  return res.text();
}

export default async function TermsPage() {
  const body = await fetchTerms();

  return (
    <div className="mx-auto max-w-narrow px-6 pt-32 pb-20">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-2 w-2 flex-shrink-0 bg-accent" />
        <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">Legal</span>
      </div>
      <h1 className="font-display text-4xl text-text">Terms of Service</h1>

      <div className="mt-12 border-border border-t pt-10">
        <ReactMarkdown components={markdownComponents}>{body}</ReactMarkdown>
      </div>
    </div>
  );
}
