import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  children: ReactNode;
  description?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  children,
  description,
  className,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-12 lg:mb-16",
        align === "center" && "text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-3 font-mono text-accent text-xs uppercase tracking-widest">
          {eyebrow}
        </p>
      )}
      <h2 className="font-semibold text-3xl text-text tracking-tight lg:text-4xl">
        {children}
      </h2>
      {description && (
        <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
