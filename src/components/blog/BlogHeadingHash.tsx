"use client";

export function BlogHeadingHash({ id, label }: { id: string; label: string }) {
  return (
    <a
      href={`#${id}`}
      aria-label={`Link to ${label}`}
      className="absolute top-[0.38em] right-full mr-2.5 font-mono text-[13px] text-text-muted no-underline opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 md:opacity-40"
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
