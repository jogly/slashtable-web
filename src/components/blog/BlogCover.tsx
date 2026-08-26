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
    <div className={`relative w-full overflow-hidden bg-surface-2 ${aspectClassName}`}>
      <Image
        src={post.image}
        alt={post.imageAlt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized
        className="object-cover"
      />
    </div>
  );
}

export function BlogCoverCredit({ post }: { post: BlogPost }) {
  return (
    <p className="text-[13px] leading-5 text-text-muted">
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
      <figcaption className="mt-0 border-border border-t pt-3">
        <BlogCoverCredit post={post} />
      </figcaption>
    </figure>
  );
}
