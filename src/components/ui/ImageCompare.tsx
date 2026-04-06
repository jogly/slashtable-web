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
    // w-12 gives a 48px touch target — wide enough to reliably tap on mobile.
    // The absolute line fills full height; the circle sits centered over it.
    <div className="relative flex h-full w-12 items-center justify-center">
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-px bg-white/60" />
      <div className="relative flex h-10 w-10 items-center justify-center rounded-full border bg-white/70 shadow-lg backdrop-blur-lg">
        <ChevronsLeftRight className="h-4 w-4 text-black/60" />
      </div>
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
