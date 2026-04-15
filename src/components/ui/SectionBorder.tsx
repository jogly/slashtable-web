import { cn } from "../../lib/utils";

interface SectionBorderProps {
  position: "top" | "bottom";
  className?: string;
}

/**
 * A full-width horizontal border with diamond markers at the content area edges.
 * Place inside a section with `position: relative` to mark section boundaries.
 *
 * The diamonds sit at the intersection of the vertical layout guides (at max-w-content edges)
 * and this horizontal border, creating the structural blueprint aesthetic.
 */
export function SectionBorder({ position, className }: SectionBorderProps) {
  const posClass = position === "top" ? "top-0" : "bottom-0";

  return (
    <div className={cn("pointer-events-none absolute inset-x-0", posClass, className)}>
      {/* Horizontal line */}
      <div className="h-px w-full bg-border" />
      {/* Diamond markers at content edges */}
      <div className="relative mx-auto max-w-content">
        <Diamond className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 max-[68rem]:hidden" />
        <Diamond className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 max-[68rem]:hidden" />
      </div>
    </div>
  );
}

export function Diamond({ className }: { className?: string }) {
  return <div className={cn("z-50 h-1.75 w-1.75 rotate-45 border border-border bg-bg", className)} />;
}
