import Link from "next/link";
import { BLOG } from "@/lib/copy";
import type { BlogPost } from "@/lib/blog";
import { formatJournalDate } from "@/lib/dates";
import { BlogCoverImage } from "./BlogCover";
import { BlogLeaderRow } from "./BlogLeaderRow";

/** Zed's archive list only earns its place once there are enough notes. */
export const BLOG_ARCHIVE_AFTER = 6;
const FEATURED_WHEN_ARCHIVED = 3;

function FeaturedCard({ post }: { post: BlogPost }) {
  return (
    <article className="overflow-hidden rounded-[6px] border border-border bg-surface transition-colors hover:border-border-strong">
      <Link href={post.path} className="block">
        <BlogCoverImage post={post} priority sizes="(min-width: 52rem) 52rem, 100vw" />
        <div className="px-6 py-5 md:px-7 md:py-6">
          <h2 className="font-display text-[1.5rem] text-text leading-[1.15] tracking-[-0.02em] md:text-[1.75rem]">
            {post.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-[15px] text-text-muted leading-[1.45]">{post.description}</p>
          <div className="mt-5 flex items-center justify-end">
            <time dateTime={post.publishedAt} className="font-mono text-[12px] text-text-muted">
              {formatJournalDate(post.publishedAt)}
            </time>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function BlogIndex({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return <p className="py-16 text-center text-[14px] text-text-muted">{BLOG.empty}</p>;
  }

  const showArchive = posts.length >= BLOG_ARCHIVE_AFTER;
  const featured = showArchive ? posts.slice(0, FEATURED_WHEN_ARCHIVED) : posts;
  const archive = showArchive ? posts.slice(FEATURED_WHEN_ARCHIVED) : [];
  const cardGrid = featured.length === FEATURED_WHEN_ARCHIVED;

  return (
    <div className="mt-14">
      <div className={cardGrid ? "grid gap-6 md:grid-cols-3" : undefined}>
        {featured.map((post) => (
          <FeaturedCard key={post.slug} post={post} />
        ))}
      </div>
      {archive.length > 0 ? (
        <div className="mt-14">
          {archive.map((post) => (
            <BlogLeaderRow key={post.slug} href={post.path} title={post.title} publishedAt={post.publishedAt} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
