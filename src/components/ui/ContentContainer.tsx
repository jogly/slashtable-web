import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export function ContentContainer({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto max-w-content px-6 lg:px-8", className)}>{children}</div>;
}
