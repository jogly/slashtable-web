import heroDark from "@screenshots/hero-dark.png";
import heroLight from "@screenshots/hero-light.png";
import { Megaphone } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ImageCompare } from "../ui/ImageCompare";

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

export function Hero() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent | TouchEvent) {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [open]);

  return (
    <section className="relative overflow-hidden pt-32 pb-20">
      <motion.div
        className="mx-auto max-w-narrow px-6 text-center"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="font-semibold text-5xl text-text leading-snug tracking-tight sm:text-6xl lg:text-[4.5rem]"
          variants={fadeUp}
        >
          The database browser
          <button
            ref={btnRef}
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="group relative inline-block border-0 bg-transparent align-baseline outline-none"
          >
            <span className="ml-1 cursor-pointer font-display text-accent">*</span>
            <div
              className={`absolute top-1/2 left-1/2 z-20 mt-3 w-80 -translate-x-1/2 rounded-2xl border border-border-strong bg-surface p-5 text-left shadow-2xl transition-opacity duration-200 ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"}`}
            >
              <p className="mb-3 font-mono text-text-muted text-xs uppercase">And also, </p>
              <ul className="space-y-3">
                {[
                  { color: "#44ff88", label: "A Data Editor", desc: "insert, update, and delete rows inline" },
                  { color: "#ffcc00", label: "An SQL Editor", desc: "write and run queries with full results" },
                  {
                    color: "#cc44ff",
                    label: "A Schema Graph Viewer",
                    desc: "draw and explore your relationships visually",
                  },
                  {
                    color: "#00d4ff",
                    label: "An MCP Server",
                    desc: "AI access to your live schema, not data",
                  },
                ].map(({ color, label, desc }) => (
                  <li key={label} className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                    <div className="flex flex-col font-mono text-xs">
                      <span className="text-text">{label}</span>
                      <span className="text-text-muted">{desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </button>{" "}
          for <span className="font-display italic tracking-wide">product engineers.</span>
        </motion.h1>
        <motion.p
          className="mx-auto mt-6 max-w-sm text-base text-text-secondary leading-relaxed md:max-w-lg"
          variants={fadeUp}
        >
          Navigate foreign keys, visualize your schema, run SQL, and give your AI agent a live read connection to your
          database — all from a keyboard-first interface built around how engineers actually work.
        </motion.p>
        <motion.div className="mt-8 flex flex-col flex-wrap items-center justify-center gap-3" variants={fadeUp}>
          <a
            href="#download"
            className="mb-4 inline-flex items-center rounded-full bg-accent px-5 py-2 font-mono text-black text-xs uppercase tracking-widest transition-colors hover:bg-white"
          >
            Download for macOS &rsaquo;
          </a>
          <div className="flex items-center justify-center gap-2 rounded-full border border-amber-500 border-dashed px-6 py-2 font-display text-text italic">
            <Megaphone className="mr-2 inline-block h-4 w-4" />
            <span> It&rsquo;s early access, there be bugs! </span>
          </div>
        </motion.div>
        {/* Feature tag strip
        <motion.div className="mt-10 flex flex-wrap items-center justify-center gap-2" variants={fadeUp}>
          {featureTags.map((f) => (
            <div key={f.label} className="flex items-center gap-2 rounded-full border border-border px-3 py-1">
              <span className="h-1.5 w-1.5 flex-shrink-0" style={{ backgroundColor: f.color }} />
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">{f.label}</span>
            </div>
          ))}
        </motion.div> */}
      </motion.div>

      {/* Hero screenshot */}
      <motion.div
        className="mx-auto mt-16 max-w-5xl px-6 lg:mt-20"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }}
      >
        <ImageCompare
          darkSrc={heroDark}
          lightSrc={heroLight}
          alt="SlashTable main window showing a data table with foreign key relationships highlighted and breadcrumb navigation — dark mode left, light mode right"
        />
      </motion.div>
    </section>
  );
}
