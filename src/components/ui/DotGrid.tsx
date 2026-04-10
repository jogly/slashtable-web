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
      className={cn("pointer-events-none absolute inset-0 opacity-[0.35]", className)}
      style={{
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    />
  );
}
