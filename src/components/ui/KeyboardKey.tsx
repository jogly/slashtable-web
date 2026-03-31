import { cn } from "../../lib/utils";

interface KeyboardKeyProps {
  children: string;
  className?: string;
}

export function KeyboardKey({ children, className }: KeyboardKeyProps) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center px-1.5 py-0.5 font-mono text-xs text-text-muted bg-bg-surface border border-border min-w-[1.5rem]",
        className
      )}
    >
      {children}
    </kbd>
  );
}
