"use client";

export function BlogHeadingHash({ id, label }: { id: string; label: string }) {
  return (
    <a
      href={`#${id}`}
      aria-label={`Link to ${label}`}
      className="absolute top-1/2 right-full mr-2.5 -translate-y-1/2 font-mono text-[0.5em] leading-none text-text no-underline opacity-[0.28] transition-opacity group-hover:opacity-70 focus-visible:opacity-70"
      onClick={() => {
        try {
          void navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#${id}`);
        } catch {
          /* navigate via href */
        }
      }}
    >
      #
    </a>
  );
}
