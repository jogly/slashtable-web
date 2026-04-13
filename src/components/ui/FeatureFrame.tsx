import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { NoiseTexture } from "./NoiseTexture";
import { Diamond } from "./SectionBorder";

interface FeatureFrameProps {
  accentColor: string;
  children: ReactNode;
  className?: string;
}

/**
 * Blueprint-style container for feature showcase sections.
 * Left/right dashed borders at content width, top/bottom lines extend full viewport.
 * Corner diamonds sit at the intersection of the two.
 */
export function FeatureFrame({ accentColor, children, className }: FeatureFrameProps) {
  return (
    <div className={cn("relative border-white/[0.06] border-x border-dashed", className)}>
      {/* Full-width top line */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-px w-screen -translate-x-1/2 bg-border" />
      {/* Full-width bottom line */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-screen -translate-x-1/2 bg-border" />
      {/* Accent glow along top edge (full-width) */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-px w-screen -translate-x-1/2"
        style={{
          background: `linear-gradient(to right, transparent, ${accentColor}50, transparent)`,
        }}
      />
      {/* Subtle radial accent warmth bleeding down from top */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${accentColor}14, transparent 60%)`,
        }}
      />
      {/* Inner crosshatch texture — the blueprint grid */}
      <NoiseTexture variant="crosshatch" opacity={0.4} />
      {/* Corner diamonds */}
      <Diamond className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
      <Diamond className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2" />
      <Diamond className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
      <Diamond className="absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2" />
      {/* Content */}
      <div className="relative p-8 lg:p-12">{children}</div>
    </div>
  );
}
