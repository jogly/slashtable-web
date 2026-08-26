export function BlogFigure({
  src,
  caption,
  alt,
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
        <img src={src} alt={alt || caption} className="h-auto w-full" />
      </div>
      {caption ? (
        <figcaption className="mt-2.5 text-[13px] leading-[1.45] text-text-muted">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
