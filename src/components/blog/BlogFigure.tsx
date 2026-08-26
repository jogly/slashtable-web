import Image from "next/image";

export function BlogFigure({
  src,
  caption,
  alt,
  priority = false,
  sizes = "(min-width: 40rem) 40rem, 100vw",
}: {
  src: string;
  caption: string;
  alt?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <figure className="my-10">
      <div className="overflow-hidden rounded-[7px] border border-border bg-surface-2">
        <Image
          src={src}
          alt={alt || caption}
          width={1600}
          height={2133}
          sizes={sizes}
          priority={priority}
          unoptimized
          className="h-auto w-full"
        />
      </div>
      {caption ? (
        <figcaption className="mt-2.5 text-[13px] leading-[1.45] text-text-muted">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
