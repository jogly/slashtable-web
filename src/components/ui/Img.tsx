import type { StaticImageData } from "next/image";
import type { ComponentProps } from "react";

export type ImageData = StaticImageData;

interface ImgProps extends Omit<ComponentProps<"img">, "src" | "srcSet" | "width" | "height"> {
  image: StaticImageData;
  sizes?: string;
}

export function Img({ image, sizes, loading = "lazy", decoding = "async", alt = "", ...rest }: ImgProps) {
  return (
    <img
      src={image.src}
      sizes={sizes}
      width={image.width}
      height={image.height}
      loading={loading}
      decoding={decoding}
      alt={alt}
      {...rest}
    />
  );
}
