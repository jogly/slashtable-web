import { ChevronsLeftRight } from "lucide-react";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import type { ImageData } from "./Img";

interface ImageCompareProps {
  /** Dark-mode screenshot (left side) */
  dark?: ImageData;
  /** Light-mode screenshot (right side) */
  light?: ImageData;
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
export function ImageCompare({ dark, light, alt, className = "", initialPosition = 70 }: ImageCompareProps) {
  const handle = (
    <div className="relative flex h-full w-8 items-center justify-center">
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-px bg-accent/60" />
      <div className="group relative flex h-7 w-7 items-center justify-center rounded-full border border-accent/40 bg-accent/90 shadow-[0_0_12px_var(--color-glow)] backdrop-blur-lg transition-transform hover:scale-110">
        <ChevronsLeftRight className="h-3 w-3 text-white" />
      </div>
      {/* Labels */}
      <span className="pointer-events-none absolute right-full mr-2 font-mono text-[8px] text-white/60 uppercase tracking-widest">
        Dark
      </span>
      <span className="pointer-events-none absolute left-full ml-2 font-mono text-[8px] text-white/60 uppercase tracking-widest">
        Light
      </span>
    </div>
  );

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {dark && light ? (
        <ReactCompareSlider
          itemOne={
            <ReactCompareSliderImage
              src={dark.src}
              srcSet={dark.srcset}
              width={dark.w}
              height={dark.h}
              alt={`${alt} — dark mode`}
            />
          }
          itemTwo={
            <ReactCompareSliderImage
              src={light.src}
              srcSet={light.srcset}
              width={light.w}
              height={light.h}
              alt={`${alt} — light mode`}
            />
          }
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
