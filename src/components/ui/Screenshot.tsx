interface ScreenshotProps {
  /** Import your image with `?w=1280;640` to get a srcset, or plain for single src */
  src: string | { src: string; srcset?: string };
  alt: string;
  className?: string;
  /** Sizes hint for the browser. Defaults to full viewport width. */
  sizes?: string;
}

/**
 * Drop a screenshot into src/assets/screenshots/, import it, and pass it here.
 * The image is already WebP + quality-85 from vite-imagetools.
 *
 * Single size:   import img from './shot.png'
 * Responsive:    import img from './shot.png?w=1280;640&as=srcset'
 */
export function Screenshot({ src, alt, className, sizes = "100vw" }: ScreenshotProps) {
  if (typeof src === "string") {
    return <img src={src} alt={alt} className={className} loading="lazy" decoding="async" />;
  }

  return (
    <img
      src={src.src}
      srcSet={src.srcset}
      sizes={sizes}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
}
