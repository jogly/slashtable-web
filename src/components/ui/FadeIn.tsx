"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useMounted } from "../../hooks/useMounted";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

export function FadeIn({ children, className, delay = 0, y = 20 }: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();
  const mounted = useMounted();

  // SSR + first client paint stay fully visible so crawlers that skip
  // opacity:0 nodes still see nested h2/h3. Entrance animation runs only
  // after mount (when `mounted` flips and this becomes a motion node).
  if (prefersReducedMotion || !mounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] as const }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
