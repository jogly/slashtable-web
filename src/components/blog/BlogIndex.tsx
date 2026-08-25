import Link from "next/link";
import { BLOG } from "@/lib/copy";
import type { BlogPost } from "@/lib/blog";
import { BlogCoverCredit, BlogCoverImage } from "./BlogCover";
import { BlogMeta } from "./BlogMeta";

function FeaturedStory({ post }: { post: BlogPost }) {
  return (
    <article>
      <h2 className="font-display text-[2.35rem] text-text leading-[1.08] tracking-[-0.02em] md:text-[2.85rem]">
        <Link href={post.path} className="transition-colors hover:text-text">
          {post.title}
        </Link>
      </h2>
      <p className="mt-5 font-display text-[1.25rem] text-text italic leading-[1.35]">{post.description}</p>
      <div className="mt-5">
        <BlogMeta post={post} />
      </div>
      <figure className="mt-10">
        <Link href={post.path} className="block">
          <BlogCoverImage
            post={post}
            priority
            aspectClassName="aspect-[3/2]"
            sizes="(min-width: 42rem) 42rem, 100vw"
          />
        </Link>
        <figcaption>
          <BlogCoverCredit post={post} />
        </figcaption>
      </figure>
    </article>
  );
}

function StoryListItem({ post }: { post: BlogPost }) {
  return (
    <article className="border-border border-t py-9 first:border-t-0 first:pt-0">
      <h2 className="font-display text-[1.65rem] text-text leading-[1.15] tracking-[-0.015em] md:text-[1.85rem]">
        <Link href={post.path}>{post.title}</Link>
      </h2>
      <p className="mt-3 text-[1.0625rem] text-text leading-[1.55]">{post.description}</p>
      <div className="mt-3">
        <BlogMeta post={post} />
      </div>
    </article>
  );
}

export function BlogIndex({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return <p className="py-16 text-[14px] text-text-muted">{BLOG.empty}</p>;
  }

  const [featured, ...rest] = posts;

  return (
    <div className="mt-14">
      <FeaturedStory post={featured} />
      {rest.length > 0 ? (
        <div className="mt-16 border-border border-t pt-2">
          {rest.map((post) => (
            <StoryListItem key={post.slug} post={post} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
