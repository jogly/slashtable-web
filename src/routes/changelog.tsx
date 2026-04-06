import { createFileRoute } from "@tanstack/react-router";
import { NAME } from "../lib/constants";

export const Route = createFileRoute("/changelog")({
  component: ChangelogPage,
});

function ChangelogPage() {
  return (
    <div className="mx-auto max-w-content px-6 pt-32 pb-20">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-2 w-2 flex-shrink-0 bg-accent" />
        <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">Changelog</span>
      </div>
      <h1 className="font-semibold text-4xl text-text tracking-tight">What's new in {NAME.short}</h1>
      <p className="mt-3 text-sm text-text-secondary leading-relaxed">Release notes and version history.</p>
      <div className="mt-12 border-border border-t pt-10 text-sm text-text-muted">
        No releases published yet. Check back soon.
      </div>
    </div>
  );
}
