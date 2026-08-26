"use client";

import { motion, useScroll, useTransform } from "motion/react";
import type { CSSProperties, RefObject } from "react";

interface SkyParallaxProps {
  targetRef: RefObject<HTMLElement | null>;
  /** Opacity pair [light, dark]. Default [0.20, 0.11] matches the version card. */
  opacity?: [number, number];
}

const skyPaint: CSSProperties = {
  backgroundColor: "var(--color-bg)",
  backgroundImage: "var(--sky-image)",
  backgroundPosition: "center",
  backgroundSize: "cover",
  filter: "saturate(0.55)",
  opacity: "var(--sky-opacity)" as unknown as number,
};

/**
 * Subtle sky parallax background.
 * First paint is a CSS `background-image` (preloaded in the document head).
 * `[data-theme=light]` swaps day/night via --sky-image — no image element, no swap.
 * Parallax only translates this same layer after hydrate.
 */
export function SkyParallax({ targetRef, opacity = [0.2, 0.11] }: SkyParallaxProps) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-32%", "32%"]);
  const [lightOp, darkOp] = opacity;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        style={
          {
            y,
            ...skyPaint,
            "--sky-opacity-dark": darkOp,
            "--sky-opacity-light": lightOp,
          } as CSSProperties
        }
        className="sky-layer absolute inset-x-0 top-[-100%] h-[300%]"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, var(--color-surface) 0%, transparent 40%, transparent 60%, var(--color-surface) 100%)",
          opacity: 0.85,
        }}
      />
    </div>
  );
}
