import heroDark from "@screenshots/hero-dark.png";
import heroLight from "@screenshots/hero-light.png";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { HERO } from "../../lib/copy";
import { DotGrid } from "../ui/DotGrid";
import { ImageCompare } from "../ui/ImageCompare";
import { NoiseTexture } from "../ui/NoiseTexture";

const tooltipColors = ["#44ff88", "#ffcc00", "#cc44ff", "#00d4ff"];
const TOOLTIP_W = 320;
const MARGIN = 12;

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
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const openTimerRef = useRef<number>(undefined);
  const closeTimerRef = useRef<number>(undefined);

  // Close on outside click (for mobile tap-to-open flow)
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

  useEffect(() => {
    return () => {
      window.clearTimeout(openTimerRef.current);
      window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  function computePosition() {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    // Center on the * button, then clamp so the tooltip stays within the viewport
    const ideal = rect.left + rect.width / 2 - TOOLTIP_W / 2;
    const left = Math.max(MARGIN, Math.min(ideal, window.innerWidth - TOOLTIP_W - MARGIN));
    setTooltipPos({ top: rect.bottom + 8, left });
  }

  function startOpen() {
    window.clearTimeout(closeTimerRef.current);
    openTimerRef.current = window.setTimeout(() => {
      computePosition();
      setOpen(true);
    }, 100);
  }

  function startClose() {
    window.clearTimeout(openTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => setOpen(false), 150);
  }

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
          className="text-balance font-semibold text-5xl text-text leading-snug tracking-tight sm:text-6xl"
          variants={fadeUp}
        >
          The database app
          <button
            ref={btnRef}
            type="button"
            onClick={() => {
              computePosition();
              setOpen((o) => !o);
            }}
            onMouseEnter={startOpen}
            onMouseLeave={startClose}
            className="inline-block border-0 bg-transparent align-baseline outline-none"
          >
            <span className="ml-1 cursor-pointer font-display text-accent">*</span>
          </button>{" "}
          for <span className="font-display italic tracking-wide">product engineers.</span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-sm text-balance font-display text-text text-xl leading-relaxed md:max-w-lg"
          variants={fadeUp}
        >
          {HERO.leader}
        </motion.p>
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

      {/* Tooltip — fixed so it escapes any overflow context; position clamped to viewport */}
      <div
        ref={tooltipRef}
        onMouseEnter={startOpen}
        onMouseLeave={startClose}
        style={{ top: tooltipPos.top, left: tooltipPos.left, width: TOOLTIP_W }}
        className={`fixed z-[200] rounded-md border border-border-strong bg-surface p-5 text-left shadow-2xl transition-opacity duration-200 ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
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
