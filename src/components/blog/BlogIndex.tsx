import Link from "next/link";
import { BLOG } from "@/lib/copy";
import type { BlogPost } from "@/lib/blog";
import { formatEntryDate } from "@/lib/dates";
import { BlogCoverCredit, BlogCoverImage } from "./BlogCover";

function StoryCard({ post, priority = false }: { post: BlogPost; priority?: boolean }) {
  return (
    <article className="group relative border-border py-12 md:px-10 md:py-14 first:md:pl-0 last:md:pr-0 [&+&]:border-t md:[&+&]:border-t-0 md:[&+&]:border-l">
      <BlogCoverImage
        post={post}
        priority={priority}
        aspectClassName="aspect-[16/9]"
        sizes="(min-width: 68rem) 32rem, 100vw"
      />
      <BlogCoverCredit post={post} />
      <h2 className="mt-6 font-display text-[22px] text-text leading-snug md:text-2xl">
        <Link href={post.path} className="after:absolute after:inset-0 after:z-[1]">
          {post.title}
          <span className="ml-1 inline-block text-text-muted opacity-0 transition-opacity group-hover:opacity-100">
            →
          </span>
        </Link>
      </h2>
      <p className="mt-3 line-clamp-3 text-base text-text-secondary leading-relaxed">{post.description}</p>
      <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[13px] text-text-muted">
        <time dateTime={post.publishedAt}>{formatEntryDate(post.publishedAt)}</time>
        {post.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </article>
  );
}

export function BlogIndex({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return <p className="py-16 font-mono text-[13px] text-text-muted">{BLOG.empty}</p>;
  }

  return (
    <div className="mt-16 border-border border-t md:grid md:grid-cols-2">
      {posts.map((post, index) => (
        <StoryCard key={post.slug} post={post} priority={index === 0} />
      ))}
    </div>
  );
}
