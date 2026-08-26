"use client";

export function BlogHeadingHash({ id, label }: { id: string; label: string }) {
  return (
    <a
      href={`#${id}`}
      aria-label={`Link to ${label}`}
      className="absolute top-0 right-full mr-2.5 font-mono text-[0.8em] leading-none text-text no-underline opacity-55 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
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
