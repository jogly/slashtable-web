interface SectionDividerProps {
  color?: string;
}

/**
 * A minimal centered divider with a colored dot, used between major page sections
 * to break visual monotony and provide wayfinding rhythm.
 */
export function SectionDivider({ color = "var(--color-accent)" }: SectionDividerProps) {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="h-px w-12 bg-border" />
      <div className="mx-3 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      <div className="h-px w-12 bg-border" />
    </div>
  );
}
