import { cn } from "../../lib/utils";

interface DotGridProps {
  className?: string;
}

/**
 * Subtle repeating dot-grid pattern used as background texture.
 * Rendered as a CSS radial-gradient so it's infinitely tileable with zero DOM cost.
 */
export function DotGrid({ className }: DotGridProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 opacity-[0.25] dark:opacity-[0.45]", className)}
      style={{
        backgroundImage: "radial-gradient(circle, var(--color-text-muted) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }}
    />
  );
}
