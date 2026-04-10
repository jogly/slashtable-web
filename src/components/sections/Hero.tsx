import heroDark from "@screenshots/hero-dark.png";
import heroLight from "@screenshots/hero-light.png";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { HERO } from "../../lib/copy";
import { DotGrid } from "../ui/DotGrid";
import { ImageCompare } from "../ui/ImageCompare";
import { NoiseTexture } from "../ui/NoiseTexture";

const tooltipColors = ["#44ff88", "#ffcc00", "#cc44ff", "#00d4ff"];

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
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent | TouchEvent) {
      const target = e.target as Node;
      if (
        btnRef.current &&
        !btnRef.current.contains(target) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(target)
      ) {
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
    <section className="relative pt-32 pb-20">
      <NoiseTexture
        variant="grain"
        opacity={0.4}
        className="[mask-image:radial-gradient(ellipse_90%_70%_at_50%_40%,black,transparent)]"
      />
      <DotGrid className="opacity-[0.25] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_30%,black,transparent)]" />
      <motion.div
        className="mx-auto max-w-narrow px-6 text-center"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-balance font-semibold text-5xl text-text leading-snug tracking-tight sm:text-6xl lg:text-[4.5rem]"
          variants={fadeUp}
        >
          The database{" "}
          <span className="inline-flex whitespace-nowrap">
            browser
            <button
              ref={btnRef}
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="inline-block border-0 bg-transparent align-baseline outline-none"
            >
              <span className="ml-1 cursor-pointer font-display text-accent">*</span>
            </button>
          </span>{" "}
          for <span className="font-display italic tracking-wide">product engineers.</span>
        </motion.h1>

        {/* Asterisk tooltip — anchored below heading, centered in container */}
        <div className="relative">
          <div
            ref={tooltipRef}
            className={`absolute left-1/2 z-20 mt-2 w-72 -translate-x-1/2 rounded-md border border-border-strong bg-surface p-5 text-left shadow-2xl transition-opacity duration-200 sm:w-80 ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <p className="mb-3 font-mono text-text-muted text-xs uppercase">{HERO.tooltipLabel}</p>
            <ul className="space-y-3">
              {HERO.tooltipItems.map((item, i) => (
                <li key={item.label} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: tooltipColors[i] }} />
                  <div className="flex flex-col font-mono text-xs">
                    <span className="text-text">{item.label}</span>
                    <span className="text-text-muted">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <motion.p
          className="mx-auto mt-6 max-w-sm text-balance font-display text-text text-xl leading-relaxed md:max-w-lg"
          variants={fadeUp}
        >
          {HERO.leader}
        </motion.p>
        <div className="mt-6">
          {HERO.description.map((p) => (
            <motion.p
              key={p}
              className="mx-auto mt-4 max-w-2xs text-balance text-sm text-text-secondary leading-relaxed md:mt-0 md:max-w-lg"
              variants={fadeUp}
            >
              {p}
            </motion.p>
          ))}
        </div>
        <motion.div className="mt-8 flex flex-col items-center gap-4" variants={fadeUp}>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#download"
              className="inline-flex items-center rounded-full bg-accent px-6 py-2.5 font-mono text-black text-xs uppercase tracking-widest shadow-[0_0_24px_-4px_rgba(201,74,0,0.4)] transition-all hover:bg-white hover:shadow-[0_0_24px_-4px_rgba(255,255,255,0.2)]"
            >
              {HERO.ctaDownload} &rsaquo;
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-full border border-border-strong px-5 py-2.5 font-mono text-[10px] text-text-secondary uppercase tracking-widest transition-colors hover:border-white hover:text-white"
            >
              {HERO.ctaFeatures} &rsaquo;
            </a>
          </div>
          <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest">{HERO.availability}</p>
        </motion.div>
      </motion.div>

      {/* Hero screenshot */}
      <motion.div
        className="mx-auto mt-16 max-w-5xl px-6 lg:mt-20"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }}
      >
        <div className="relative overflow-hidden rounded-2xl shadow-[0_0_80px_-12px_rgba(201,74,0,0.15),0_0_32px_-8px_rgba(201,74,0,0.1)]">
          <div className="-mt-px">
            <ImageCompare darkSrc={heroDark} lightSrc={heroLight} alt={HERO.screenshotAlt} />
          </div>
          {/* Inset ring masks 1px of image edges */}
          <div className="pointer-events-none absolute inset-0 z-50 rounded-2xl ring-1 ring-white/10 ring-inset" />
        </div>
      </motion.div>
    </section>
  );
}
