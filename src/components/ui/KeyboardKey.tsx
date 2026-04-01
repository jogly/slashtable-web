import { cn } from "../../lib/utils";

interface KeyboardKeyProps {
  children: string;
  className?: string;
}

export function KeyboardKey({ children, className }: KeyboardKeyProps) {
  return (
    <kbd
      className={cn(
        "inline-flex min-w-[1.5rem] items-center justify-center border border-border bg-bg-surface px-1.5 py-0.5 font-mono text-text-muted text-xs",
        className
      )}
    >
      {children}
    </kbd>
  );
}
