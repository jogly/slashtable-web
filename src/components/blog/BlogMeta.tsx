import type { BlogPost } from "@/lib/blog";
import { readingTimeLabel } from "@/lib/blog";
import { formatJournalDate } from "@/lib/dates";

export function BlogMeta({
  post,
  showTags = false,
}: {
  post: BlogPost;
  showTags?: boolean;
}) {
  return (
    <p className="text-[14px] leading-6 text-text-muted">
      <time dateTime={post.publishedAt}>{formatJournalDate(post.publishedAt)}</time>
      {post.updatedAt && post.updatedAt !== post.publishedAt ? (
        <>
          <span aria-hidden> · </span>
          <time dateTime={post.updatedAt}>Updated {formatJournalDate(post.updatedAt)}</time>
        </>
      ) : null}
      <span aria-hidden> · </span>
      <span>{readingTimeLabel(post)}</span>
      {showTags
        ? post.tags.map((tag) => (
            <span key={tag}>
              <span aria-hidden> · </span>
              {tag}
            </span>
          ))
        : null}
    </p>
  );
}
