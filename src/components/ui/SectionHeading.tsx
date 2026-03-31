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
        <p className="mb-3 font-mono text-xs tracking-widest text-accent uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-semibold tracking-tight text-text lg:text-4xl">
        {children}
      </h2>
      {description && (
        <p className="mt-4 max-w-2xl text-lg text-text-secondary leading-relaxed mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
