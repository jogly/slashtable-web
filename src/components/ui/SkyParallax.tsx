"use client";

import skyDay from "@assets/sky-day.png";
import skyNight from "@assets/sky-night.png";
import { motion, useScroll, useTransform } from "motion/react";
import type { RefObject } from "react";
import { Img } from "./Img";

interface SkyParallaxProps {
  targetRef: RefObject<HTMLElement | null>;
  /** Opacity pair [light, dark]. Default [0.20, 0.11] matches the version card. */
  opacity?: [number, number];
}

/**
 * Subtle sky parallax background.
 * Both day and night assets are in the SSR tree; CSS picks which one is
 * visible from `[data-theme]` so the sky is present on first paint.
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
      <motion.div style={{ y }} className="absolute inset-x-0 top-[-100%] h-[300%]">
        <Img
          image={skyNight}
          alt=""
          draggable={false}
          loading="eager"
          className="h-full w-full select-none object-cover [[data-theme=light]_&]:hidden"
          style={{
            filter: "saturate(0.55)",
            opacity: darkOp,
          }}
        />
        <Img
          image={skyDay}
          alt=""
          draggable={false}
          loading="eager"
          className="hidden h-full w-full select-none object-cover [[data-theme=light]_&]:block"
          style={{
            filter: "saturate(0.55)",
            opacity: lightOp,
          }}
        />
      </motion.div>
      {/* Vignette — fades the image into the container edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, var(--color-surface-1) 0%, transparent 40%, transparent 60%, var(--color-surface-1) 100%)",
          opacity: 0.85,
        }}
      />
    </div>
  );
}
