import Link from "next/link";
import { BLOG } from "@/lib/copy";
import type { BlogPost } from "@/lib/blog";
import { readingTimeLabel } from "@/lib/blog";
import { formatJournalDate } from "@/lib/dates";

function NewestStory({ post }: { post: BlogPost }) {
  return (
    <article className="border-border border-t py-8 first:border-t-0 first:pt-0">
      <h2 className="font-display text-[1.65rem] text-text leading-[1.15] tracking-[-0.02em] md:text-[1.85rem]">
        <Link href={post.path}>{post.title}</Link>
      </h2>
      <p className="mt-3 text-[1.0625rem] text-text leading-[1.5]">{post.description}</p>
      <p className="mt-3 text-[14px] leading-6 text-text-muted">
        <time dateTime={post.publishedAt}>{formatJournalDate(post.publishedAt)}</time>
        <span aria-hidden> · </span>
        <span>{readingTimeLabel(post)}</span>
        <span aria-hidden> · </span>
        <span>Newest</span>
      </p>
    </article>
  );
}

function StoryRow({ post }: { post: BlogPost }) {
  return (
    <article className="border-border border-t py-6">
      <h2 className="font-display text-[1.25rem] text-text leading-[1.2] tracking-[-0.015em] md:text-[1.35rem]">
        <Link href={post.path}>{post.title}</Link>
      </h2>
      <p className="mt-2 text-[14px] leading-6 text-text-muted">
        <time dateTime={post.publishedAt}>{formatJournalDate(post.publishedAt)}</time>
      </p>
    </article>
  );
}

export function BlogIndex({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return <p className="py-16 text-[14px] text-text-muted">{BLOG.empty}</p>;
  }

  const [newest, ...rest] = posts;

  return (
    <div className="mt-10">
      <NewestStory post={newest} />
      {rest.map((post) => (
        <StoryRow key={post.slug} post={post} />
      ))}
    </div>
  );
}
