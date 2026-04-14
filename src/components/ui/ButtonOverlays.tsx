/**
 * Material overlay layers for button depth & texture:
 *  - Vertical sheen gradient (subtle material highlight top → darker bottom)
 *  - Real SVG turbulence noise (high variance, non-repetitive) as grain
 *
 * Place inside a `relative overflow-hidden` button. All children of the
 * button that should render above the overlays need their own `relative` class.
 */

const NOISE_SVG = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'>
    <filter id='n'>
      <feTurbulence type='fractalNoise' baseFrequency='1.8' numOctaves='3' stitchTiles='stitch' seed='7'/>
      <feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0'/>
    </filter>
    <rect width='100%' height='100%' filter='url(#n)'/>
  </svg>`,
);

const NOISE_URL = `url("data:image/svg+xml;utf8,${NOISE_SVG}")`;

interface Props {
  /** Opacity of the grain layer. Default 0.16. Reduce for smaller/more subtle buttons. */
  grainOpacity?: number;
  /** Tone of the sheen: "light" for bright surfaces (filled buttons), "subtle" for translucent. */
  sheen?: "light" | "subtle" | "none";
}

export function ButtonOverlays({ grainOpacity = 0.16, sheen = "light" }: Props) {
  const sheenGradient =
    sheen === "none"
      ? null
      : sheen === "subtle"
        ? "linear-gradient(to bottom, rgba(255,255,255,0.03) 0%, transparent 50%, rgba(0,0,0,0.03) 100%)"
        : "linear-gradient(to bottom, rgba(255,255,255,0.06) 0%, transparent 45%, rgba(0,0,0,0.05) 100%)";

  return (
    <>
      {sheenGradient && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: sheenGradient }}
        />
      )}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mix-blend-overlay"
        style={{
          backgroundImage: NOISE_URL,
          backgroundSize: "120px 120px",
          opacity: grainOpacity,
        }}
      />
    </>
  );
}
