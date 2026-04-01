import { motion } from "motion/react";
import { AppWindowMockup } from "../ui/AppWindowMockup";

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const featureTags = [
  { label: "MCP Server", color: "#00d4ff" },
  { label: "Plugin System", color: "#cc44ff" },
  { label: "Relationship Nav", color: "#44ff88" },
  { label: "Vim Bindings", color: "#ffcc00" },
  { label: "Docker Detection", color: "#c94a00" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20">
      <motion.div
        className="mx-auto max-w-narrow px-6 text-center"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="font-semibold text-5xl text-text tracking-tight sm:text-6xl lg:text-[4.5rem] lg:leading-[1.05]"
          variants={fadeUp}
        >
          Your database, navigable.
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-sm text-base text-text-secondary leading-relaxed"
          variants={fadeUp}
        >
          Schema-aware browsing with an embedded MCP server, a plugin system,
          and keyboard-first navigation. Built native in Rust.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
          variants={fadeUp}
        >
          <a
            href="#download"
            className="inline-flex items-center rounded-full bg-accent px-5 py-2 font-mono text-black text-xs uppercase tracking-widest transition-colors hover:bg-white"
          >
            Download for macOS &rsaquo;
          </a>
        </motion.div>

        {/* Feature tag strip */}
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
          variants={fadeUp}
        >
          {featureTags.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-2 rounded-full border border-border px-3 py-1"
            >
              <span
                className="h-1.5 w-1.5 flex-shrink-0"
                style={{ backgroundColor: f.color }}
              />
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
                {f.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* App window mockup */}
      <motion.div
        className="mx-auto mt-16 max-w-5xl px-6 lg:mt-20"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }}
      >
        <AppWindowMockup />
      </motion.div>
    </section>
  );
}
