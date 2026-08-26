export function BlogOnThisPage({ headings }: { headings: { id: string; text: string }[] }) {
  if (headings.length < 2) return null;

  return (
    <nav className="hidden w-[12.5rem] shrink-0 lg:block" aria-label="On this page">
      <div className="lg:sticky lg:top-28">
        <p className="font-mono text-[11px] text-text-muted uppercase tracking-wide">On this page</p>
        <ul className="mt-3 space-y-2.5">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className="text-[13px] text-text-muted leading-snug underline decoration-transparent underline-offset-2 transition-colors hover:text-text hover:decoration-border-strong"
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
