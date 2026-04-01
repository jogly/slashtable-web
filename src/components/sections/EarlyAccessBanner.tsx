export function EarlyAccessBanner() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto flex max-w-[68rem] flex-col items-center gap-4 px-6 py-6 sm:flex-row sm:justify-center sm:gap-6">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 shrink-0 bg-cyan" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
            Early Access
          </span>
          <span className="hidden h-px w-4 bg-border-strong sm:block" />
          <p className="text-sm text-text-secondary">
            Free while in development. Like what you see?
          </p>
        </div>
        <a
          href="https://buymeacoffee.com/jogly"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-full border border-border-strong px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-text-secondary transition-colors hover:border-white hover:text-white"
        >
          Buy me a coffee
        </a>
      </div>
    </section>
  );
}
