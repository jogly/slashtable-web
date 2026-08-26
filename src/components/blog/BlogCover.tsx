import Image from "next/image";
import type { BlogPost } from "@/lib/blog";

export function BlogCoverImage({
  post,
  sizes,
  priority = false,
  aspectClassName = "aspect-video",
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
        className="object-cover object-right"
      />
    </div>
  );
}
