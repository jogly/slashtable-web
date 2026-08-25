import Image from "next/image";
import type { BlogPost } from "@/lib/blog";

export function BlogCoverImage({
  post,
  sizes,
  priority = false,
  aspectClassName,
}: {
  post: BlogPost;
  sizes: string;
  priority?: boolean;
  aspectClassName: string;
}) {
  return (
    <div className={`overflow-hidden rounded-[5px] bg-surface-2 ${aspectClassName}`}>
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
    <p className="relative z-10 mt-2">
      <a
        href={post.imageCreditUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-[10px] text-text-muted tracking-wide transition-colors hover:text-text"
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
  aspectClassName,
}: {
  post: BlogPost;
  sizes: string;
  priority?: boolean;
  aspectClassName: string;
}) {
  return (
    <figure>
      <BlogCoverImage post={post} sizes={sizes} priority={priority} aspectClassName={aspectClassName} />
      <figcaption>
        <BlogCoverCredit post={post} />
      </figcaption>
    </figure>
  );
}
