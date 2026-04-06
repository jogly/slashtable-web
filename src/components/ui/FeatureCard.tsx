import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon: Icon, title, description, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group border border-border p-6 transition-colors hover:border-border-strong hover:bg-bg-surface/50",
        className,
      )}
    >
      <Icon className="mb-4 h-5 w-5 text-accent" strokeWidth={1.5} />
      <h3 className="mb-2 font-semibold text-sm text-text">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
    </div>
  );
}
