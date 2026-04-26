"use client";

import skyDay from "@assets/sky-day.png";
import skyNight from "@assets/sky-night.png";
import { motion, useScroll, useTransform } from "motion/react";
import type { RefObject } from "react";
import { useTheme } from "../providers/ThemeProvider";
import { Img } from "./Img";

interface SkyParallaxProps {
  targetRef: RefObject<HTMLElement | null>;
  /** Opacity pair [light, dark]. Default [0.20, 0.11] matches the version card. */
  opacity?: [number, number];
}

/**
 * Subtle sky parallax background.
 * - Day image in light mode, night image in dark mode.
 * - Image translates gently as the user scrolls past `targetRef`.
 * - Wrap this inside a `relative overflow-hidden` container; place content at z-10.
 */
export function SkyParallax({ targetRef, opacity = [0.2, 0.11] }: SkyParallaxProps) {
  const { theme } = useTheme();
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
          image={theme === "light" ? skyDay : skyNight}
          alt=""
          draggable={false}
          loading="eager"
          className="h-full w-full select-none object-cover"
          style={{
            filter: "saturate(0.55)",
            opacity: theme === "light" ? lightOp : darkOp,
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
