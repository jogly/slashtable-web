import Image from "next/image";

export function BlogFigure({
  src,
  caption,
  alt,
  priority = false,
  sizes = "(min-width: 48rem) 40rem, 100vw",
  aspectClassName = "aspect-video",
}: {
  src: string;
  caption: string;
  alt?: string;
  priority?: boolean;
  sizes?: string;
  aspectClassName?: string;
}) {
  return (
    <figure className="my-10">
      <div className={`relative w-full overflow-hidden bg-surface-2 ${aspectClassName}`}>
        <Image
          src={src}
          alt={alt || caption}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized
          className="object-cover object-right"
        />
      </div>
      {caption ? (
        <figcaption className="border-border-strong border-t pt-3 text-[13px] leading-[1.45] text-text-muted italic">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
