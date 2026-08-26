import Link from "next/link";
import { BLOG } from "@/lib/copy";
import type { BlogPost } from "@/lib/blog";
import { BlogDate } from "./BlogMeta";
import { BlogLeaderRow } from "./BlogLeaderRow";

/** Zed's archive list only earns its place once there are enough notes. */
export const BLOG_ARCHIVE_AFTER = 6;
const FEATURED_WHEN_ARCHIVED = 3;

function StoryCard({ post }: { post: BlogPost }) {
  return (
    <article className="border-border border">
      <Link href={post.path} className="block px-6 py-6 md:px-8 md:py-8">
        <h2 className="font-display text-[1.65rem] text-text leading-[1.15] tracking-[-0.02em] md:text-[1.85rem]">
          {post.title}
        </h2>
        <p className="mt-3 text-[1.05rem] text-text-muted leading-[1.5]">{post.description}</p>
        <div className="mt-5">
          <BlogDate publishedAt={post.publishedAt} updatedAt={post.updatedAt} />
        </div>
      </Link>
    </article>
  );
}

export function BlogIndex({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return <p className="py-16 text-[14px] text-text-muted">{BLOG.empty}</p>;
  }

  const showArchive = posts.length >= BLOG_ARCHIVE_AFTER;
  const featured = showArchive ? posts.slice(0, FEATURED_WHEN_ARCHIVED) : posts;
  const archive = showArchive ? posts.slice(FEATURED_WHEN_ARCHIVED) : [];
  const cardGrid = featured.length === FEATURED_WHEN_ARCHIVED;

  return (
    <div className="mt-10">
      <div className={cardGrid ? "grid gap-6 md:grid-cols-3" : undefined}>
        {featured.map((post) => (
          <StoryCard key={post.slug} post={post} />
        ))}
      </div>
      {archive.length > 0 ? (
        <div className="mt-12">
          {archive.map((post) => (
            <BlogLeaderRow key={post.slug} href={post.path} title={post.title} publishedAt={post.publishedAt} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
