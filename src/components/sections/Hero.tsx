import heroDark from "@screenshots/hero-dark.png?as=img";
import heroLight from "@screenshots/hero-light.png?as=img";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { HERO } from "../../lib/copy";
import { useTheme } from "../providers/ThemeProvider";
import { ButtonOverlays } from "../ui/ButtonOverlays";
import { DotGrid } from "../ui/DotGrid";
import { ImageCompare } from "../ui/ImageCompare";
import { NoiseTexture } from "../ui/NoiseTexture";
import { SkyParallax } from "../ui/SkyParallax";

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

function CtaDownload() {
  return (
    <a
      href="#download"
      className="group relative inline-flex h-10 items-center gap-1.5 overflow-hidden rounded-sm bg-accent px-5 font-mono text-white text-xs uppercase tracking-widest shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.12)] transition-[background-color,box-shadow] duration-150 hover:bg-[color-mix(in_srgb,var(--color-accent)_92%,white)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.12)] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.12)]"
    >
      <ButtonOverlays grainOpacity={0.36} />
      <span className="relative">{HERO.ctaDownload}</span>
      <span className="relative opacity-70">&rsaquo;</span>
    </a>
  );
}

function CtaFeatures() {
  return (
    <a
      href="#features"
      className="group relative inline-flex h-10 items-center gap-1.5 overflow-hidden rounded-sm border border-border-strong border-dashed bg-bg/40 px-5 font-mono text-text-secondary text-xs uppercase tracking-widest backdrop-blur-sm transition-[background-color,border-color,color] duration-150 hover:border-text/50 hover:bg-bg/70 hover:text-text"
    >
      <ButtonOverlays grainOpacity={0.1} sheen="subtle" />
      <span className="relative">{HERO.ctaFeatures}</span>
      <span className="relative opacity-70">&rsaquo;</span>
    </a>
  );
}

export function Hero() {
  const { theme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
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
    <section ref={sectionRef} className="relative overflow-hidden pt-36 pb-24 lg:pt-40 lg:pb-28">
      <SkyParallax targetRef={sectionRef} />
      <NoiseTexture
        variant="grain"
        opacity={0.4}
        className="[mask-image:radial-gradient(ellipse_90%_70%_at_50%_40%,black,transparent)]"
      />
      <DotGrid className="opacity-[0.25] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_30%,black,transparent)]" />
      <motion.div
        className="relative z-10 mx-auto max-w-narrow px-6 text-center"
        variants={prefersReducedMotion ? undefined : stagger}
        initial={prefersReducedMotion ? undefined : "hidden"}
        animate={prefersReducedMotion ? undefined : "visible"}
      >
        <motion.h1
          className="text-balance font-semibold text-5xl text-text leading-snug tracking-tight sm:text-6xl"
          variants={prefersReducedMotion ? undefined : fadeUp}
        >
          The database app
          <button
            ref={btnRef}
            type="button"
            aria-label="What makes this different"
            onClick={() => {
              computePosition();
              setOpen((o) => !o);
            }}
            onMouseEnter={startOpen}
            onMouseLeave={startClose}
            className="inline-block border-0 bg-transparent align-baseline outline-none focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            <span className="ml-1 cursor-pointer font-display text-accent">*</span>
          </button>{" "}
          for <span className="font-display italic tracking-wide">product engineers.</span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-sm text-balance font-display text-text text-xl leading-relaxed md:max-w-lg"
          variants={prefersReducedMotion ? undefined : fadeUp}
        >
          {HERO.leader}
        </motion.p>
        <motion.div
          className="mt-8 flex flex-col items-center gap-4"
          variants={prefersReducedMotion ? undefined : fadeUp}
        >
          <div className="relative hidden sm:inline-block">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-10"
              style={{
                backgroundImage: "radial-gradient(circle, var(--color-text-muted) 0.75px, transparent 0.75px)",
                backgroundSize: "14px 14px",
                maskImage: "radial-gradient(ellipse 65% 75% at 50% 50%, black 10%, transparent 70%)",
                WebkitMaskImage: "radial-gradient(ellipse 65% 75% at 50% 50%, black 10%, transparent 70%)",
                opacity: 0.35,
              }}
            />
            <div className="relative flex items-stretch">
              {/*<BlueprintRule orientation="vertical" />*/}
              <div className="flex items-center p-4">
                <CtaDownload />
              </div>
              {/*<BlueprintRule orientation="vertical" />*/}
              <div className="flex items-center p-4">
                <CtaFeatures />
              </div>
              {/*<BlueprintRule orientation="vertical" />*/}
              {/*<BlueprintRule orientation="horizontal" className="top-0 right-0 left-0" />*/}
              {/*<BlueprintRule orientation="horizontal" className="right-0 bottom-0 left-0" />*/}
            </div>
          </div>
          {/* Mobile: plain button row, no frame */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:hidden">
            <CtaDownload />
            <CtaFeatures />
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
              <span
                className="mt-2 h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: tooltipColors[i] }}
                aria-hidden="true"
              />
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
        className="relative z-10 mx-auto mt-16 max-w-5xl px-6 lg:mt-20"
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={
          prefersReducedMotion ? undefined : { duration: 0.7, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }
        }
      >
        <div className="relative overflow-hidden rounded-2xl shadow-[0_0_80px_-12px_var(--color-glow-soft),0_0_32px_-8px_var(--color-glow-soft)]">
          <div className="-mt-px">
            <ImageCompare
              dark={theme === "dark" ? heroDark : heroLight}
              light={theme === "dark" ? heroLight : heroDark}
              alt={HERO.screenshotAlt}
            />
          </div>
          {/* Inset ring masks 1px of image edges */}
          <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl ring-1 ring-border-strong ring-inset" />
        </div>
      </motion.div>
    </section>
  );
}
