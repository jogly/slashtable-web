import { ChevronsLeftRight } from "lucide-react";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";

interface ImageCompareProps {
  /** Path to the dark-mode screenshot (left side) */
  darkSrc?: string;
  /** Path to the light-mode screenshot (right side) */
  lightSrc?: string;
  alt: string;
  className?: string;
  /** Initial divider position as a percentage (0–100). Defaults to 50. */
  initialPosition?: number;
}

/**
 * Drag the handle left/right to reveal the dark-mode screenshot (left)
 * vs the light-mode screenshot (right).
 *
 * Drop screenshots in src/assets/screenshots/ and pass them as darkSrc / lightSrc.
 * While either prop is missing, a styled placeholder is shown instead.
 */
export function ImageCompare({ darkSrc, lightSrc, alt, className = "", initialPosition = 70 }: ImageCompareProps) {
  const handle = (
    <div className="relative flex h-full w-14 items-center justify-center">
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-px bg-white/60" />
      <div className="group relative flex h-12 w-12 animate-[pulse_3s_ease-in-out_2] items-center justify-center rounded-full border border-white/40 bg-white/80 shadow-[0_0_20px_rgba(255,255,255,0.3)] backdrop-blur-lg transition-transform hover:scale-110">
        <ChevronsLeftRight className="h-5 w-5 text-black/70" />
      </div>
      {/* Labels */}
      <span className="pointer-events-none absolute right-full mr-3 font-mono text-[9px] text-white/60 uppercase tracking-widest">
        Dark
      </span>
      <span className="pointer-events-none absolute left-full ml-3 font-mono text-[9px] text-white/60 uppercase tracking-widest">
        Light
      </span>
    </div>
  );

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {darkSrc && lightSrc ? (
        <ReactCompareSlider
          itemOne={<ReactCompareSliderImage src={darkSrc} alt={`${alt} — dark mode`} />}
          itemTwo={<ReactCompareSliderImage src={lightSrc} alt={`${alt} — light mode`} />}
          defaultPosition={initialPosition}
          handle={handle}
          style={{ width: "100%" }}
        />
      ) : (
        /* Placeholder shown until both screenshots are supplied */
        <div className="flex aspect-video w-full">
          <div className="flex flex-1 items-center justify-center border border-border border-dashed bg-surface/50">
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">Dark</span>
          </div>
          <div className="flex flex-1 items-center justify-center border border-border border-dashed bg-surface/30">
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">Light</span>
          </div>
        </div>
      )}
    </div>
  );
}
