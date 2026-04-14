import noiseCrosshatch from "@assets/noise-crosshatch.png";
import noiseGrain from "@assets/noise-grain.png";
import noiseSpeckle from "@assets/noise-speckle.png";
import { cn } from "../../lib/utils";

const textures = {
  grain: noiseGrain,
  crosshatch: noiseCrosshatch,
  speckle: noiseSpeckle,
} as const;

interface NoiseTextureProps {
  variant?: keyof typeof textures;
  opacity?: number;
  className?: string;
}

/**
 * Tiling noise texture overlay. Place inside a `position: relative` container.
 * Adds subtle material texture to section backgrounds — matching the tactile,
 * "printed on paper" feel visible in Zed's section backgrounds.
 *
 * Variants:
 * - grain: Fine film grain — scattered white/dark specks (default for most sections)
 * - crosshatch: 16px grid lines with noise — blueprint/data-table aesthetic
 * - speckle: Denser grain — more visible material texture for elevated surfaces
 *
 * Textures are white-on-transparent PNGs; light mode inverts them automatically.
 */
export function NoiseTexture({ variant = "grain", opacity = 0.5, className }: NoiseTextureProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 [[data-theme=light]_&]:invert", className)}
      style={{
        backgroundImage: `url(${textures[variant]})`,
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
        opacity,
      }}
    />
  );
}
