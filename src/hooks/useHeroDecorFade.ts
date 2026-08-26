"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Decorative layers (sky, grain, product shot) start fully visible in the
 * SSR HTML so crawlers and no-js see the real page. After hydrate, JS may
 * opt those layers into a CSS fade. `prefers-reduced-motion: reduce` keeps
 * the settled full state. Never use this on headings or CTA copy.
 */
export function useHeroDecorFade(): boolean {
  const prefersReducedMotion = useReducedMotion();
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;
    setRun(true);
  }, [prefersReducedMotion]);

  return run;
}
