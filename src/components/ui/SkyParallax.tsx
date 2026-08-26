"use client";

import { motion, useScroll, useTransform } from "motion/react";
import type { CSSProperties, RefObject } from "react";

interface SkyParallaxProps {
  targetRef: RefObject<HTMLElement | null>;
  /** Opacity pair [light, dark]. Default [0.20, 0.11] matches the version card. */
  opacity?: [number, number];
}

/**
 * Subtle sky parallax background.
 * First paint is a CSS `background-image` (preloaded in the document head).
 * `[data-theme=light]` swaps day/night without swapping DOM nodes. Parallax
 * only translates this same layer after hydrate.
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
      {/* Motion div is 3x the container height with 100% buffer on each side so the ±32% translation
          (≈96% of container height) never exposes the container edges. */}
      <motion.div
        style={
          {
            y,
            "--sky-opacity-dark": darkOp,
            "--sky-opacity-light": lightOp,
          } as CSSProperties
        }
        className="sky-layer absolute inset-x-0 top-[-100%] h-[300%]"
      />
      <div className="sky-vignette absolute inset-0" />
    </div>
  );
}
