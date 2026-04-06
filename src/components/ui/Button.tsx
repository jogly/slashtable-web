import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
  color?: string; // for colored pill variant
}

export function Button({ variant = "primary", children, className, color, ...props }: ButtonProps) {
  return (
    <a
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2 font-mono text-xs uppercase tracking-widest transition-all",
        variant === "primary" && !color && "bg-cyan text-black hover:bg-white",
        variant === "secondary" &&
          "border border-border-strong text-text-secondary hover:border-white hover:text-white",
        variant === "ghost" && "text-text-muted hover:text-text",
        color && `text-black`,
        className,
      )}
      style={color ? { backgroundColor: color } : undefined}
      {...props}
    >
      {children}
    </a>
  );
}
