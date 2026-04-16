import type { ComponentProps } from "react";

export interface ImageData {
  src: string;
  w: number;
  h: number;
  srcset?: string;
}

interface ImgProps extends Omit<ComponentProps<"img">, "src" | "srcSet" | "width" | "height"> {
  image: ImageData;
  sizes?: string;
}

export function Img({ image, sizes, loading = "lazy", decoding = "async", alt = "", ...rest }: ImgProps) {
  return (
    <img
      src={image.src}
      srcSet={image.srcset}
      sizes={image.srcset ? sizes : undefined}
      width={image.w}
      height={image.h}
      loading={loading}
      decoding={decoding}
      alt={alt}
      {...rest}
    />
  );
}
