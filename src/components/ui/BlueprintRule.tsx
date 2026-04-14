import { cn } from "../../lib/utils";

interface BlueprintRuleProps {
  orientation: "vertical" | "horizontal";
  className?: string;
  /** How far the rule extends past its container, in px. Default 14 vertical / 4 horizontal. */
  overshoot?: number;
}

/**
 * A non-linear fade mask expressed in ABSOLUTE px — the fade always happens in
 * the `end` px at each side of the rule, regardless of total length.
 *
 * Curve: 0 → 0.20 → 0.65 → 0.90 → 1 over the first `end` px (approximates ease-in-out),
 * plateau, mirror on the far end.
 */
function fadeMask(direction: "to bottom" | "to right", end: number): string {
  return `linear-gradient(${direction},
    transparent 0,
    rgba(0,0,0,0.20) ${end * 0.3}px,
    rgba(0,0,0,0.65) ${end * 0.6}px,
    rgba(0,0,0,0.90) ${end * 0.85}px,
    black ${end}px,
    black calc(100% - ${end}px),
    rgba(0,0,0,0.90) calc(100% - ${end * 0.85}px),
    rgba(0,0,0,0.65) calc(100% - ${end * 0.6}px),
    rgba(0,0,0,0.20) calc(100% - ${end * 0.3}px),
    transparent 100%)`;
}

/**
 * Graphite-grain turbulence as a data-URL SVG.
 *
 * We use this as a MASK on the speckle layer: the layer paints `bg-text` where the
 * noise is opaque, producing visible pencil-like luminance variation along the line.
 * (`mix-blend-overlay` didn't show up on a 1px rule — too little pixel area.)
 */
const NOISE_SVG_FOR_MASK = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'>
    <filter id='p'>
      <feTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' seed='11'/>
      <feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 2.2 -0.3'/>
    </filter>
    <rect width='100%' height='100%' filter='url(#p)'/>
  </svg>`,
);
const NOISE_MASK = `url("data:image/svg+xml;utf8,${NOISE_SVG_FOR_MASK}")`;

export function BlueprintRule({ orientation, className, overshoot }: BlueprintRuleProps) {
  const isV = orientation === "vertical";
  const over = overshoot ?? (isV ? 14 : 4);
  const dir = isV ? "to bottom" : "to right";
  const fade = fadeMask(dir, over);

  // Vertical: flex item (relative + w-px) — its inner rule extends past top/bottom.
  // Horizontal: absolute on the flex row — its inner rule extends past left/right.
  const outerBase = isV ? "pointer-events-none relative w-px" : "pointer-events-none absolute h-px";

  // The rule renders in two layers inside the outer:
  //  1. Base — a faint line that's always visible, fade-masked at the ends.
  //  2. Speckle — a stronger line, fade-masked AND noise-masked. Where the noise is
  //     opaque the speckle paints; where it's transparent nothing paints. The result
  //     on top of the base is a line with varying luminance along its length.
  return (
    <div aria-hidden="true" className={cn(outerBase, className)}>
      {/* 1. Base rule — constant faint line */}
      <div
        className="absolute bg-text-muted/40"
        style={{
          inset: isV ? `-${over}px 0` : `0 -${over}px`,
          opacity: 0.18,
          WebkitMaskImage: fade,
          maskImage: fade,
        }}
      />
      {/* 2. Speckle rule — noise-modulated stronger line */}
      <div
        className="absolute bg-text-muted/40"
        style={{
          // Slightly widened so the noise has more pixel area to show through
          inset: isV ? `-${over}px -0.5px` : `-0.5px -${over}px`,
          opacity: 0.45,
          WebkitMaskImage: `${NOISE_MASK}, ${fade}`,
          maskImage: `${NOISE_MASK}, ${fade}`,
          WebkitMaskSize: isV ? "2px 80px, 100% 100%" : "80px 2px, 100% 100%",
          maskSize: isV ? "2px 80px, 100% 100%" : "80px 2px, 100% 100%",
          WebkitMaskRepeat: "repeat, no-repeat",
          maskRepeat: "repeat, no-repeat",
          WebkitMaskComposite: "source-in",
          maskComposite: "intersect",
        }}
      />
    </div>
  );
}
