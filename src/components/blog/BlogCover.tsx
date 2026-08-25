import Image from "next/image";
import type { BlogPost } from "@/lib/blog";

export function BlogCoverImage({
  post,
  sizes,
  priority = false,
  aspectClassName = "aspect-[3/2]",
}: {
  post: BlogPost;
  sizes: string;
  priority?: boolean;
  aspectClassName?: string;
}) {
  return (
    <div className={`overflow-hidden bg-surface-2 ${aspectClassName}`}>
      <Image
        src={post.image}
        alt={post.imageAlt}
        width={post.imageWidth}
        height={post.imageHeight}
        sizes={sizes}
        priority={priority}
        unoptimized
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export function BlogCoverCredit({ post }: { post: BlogPost }) {
  return (
    <p className="mt-2.5 text-[13px] leading-5 text-text-muted">
      <a
        href={post.imageCreditUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-transparent underline-offset-2 transition-colors hover:text-text hover:decoration-border-strong"
      >
        {post.imageCredit}
      </a>
    </p>
  );
}

export function BlogCover({
  post,
  sizes,
  priority = false,
  aspectClassName = "aspect-[3/2]",
}: {
  post: BlogPost;
  sizes: string;
  priority?: boolean;
  aspectClassName?: string;
}) {
  return (
    <figure className="m-0">
      <BlogCoverImage post={post} sizes={sizes} priority={priority} aspectClassName={aspectClassName} />
      <figcaption>
        <BlogCoverCredit post={post} />
      </figcaption>
    </figure>
  );
}
