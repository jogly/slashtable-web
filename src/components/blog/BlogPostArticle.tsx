import { BLOG } from "@/lib/copy";
import type { BlogPost } from "@/lib/blog";
import { formatEntryDate } from "@/lib/dates";
import { BlogCover } from "./BlogCover";
import { BlogMarkdown } from "./BlogMarkdown";

export function BlogPostArticle({ post }: { post: BlogPost }) {
  return (
    <article>
      <div className="mb-4 flex items-center gap-2">
        <span className="h-2 w-2 flex-shrink-0 bg-accent" />
        <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">{BLOG.eyebrow}</span>
      </div>
      <h1 className="font-display text-4xl text-text md:text-5xl">{post.title}</h1>
      <p className="mt-4 text-base text-text leading-7">{post.description}</p>
      <div className="mt-5 flex flex-wrap items-baseline gap-3">
        <time className="font-mono text-[10px] text-text-muted uppercase tracking-widest" dateTime={post.publishedAt}>
          {formatEntryDate(post.publishedAt)}
        </time>
        {post.updatedAt && post.updatedAt !== post.publishedAt ? (
          <time className="font-mono text-[10px] text-text-muted uppercase tracking-widest" dateTime={post.updatedAt}>
            {BLOG.updatedLabel} {formatEntryDate(post.updatedAt)}
          </time>
        ) : null}
        {post.tags.map((tag) => (
          <span key={tag} className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
            {tag}
          </span>
        ))}
      </div>

      <div className="group mt-10">
        <BlogCover
          post={post}
          priority
          aspectClassName="aspect-[16/9]"
          sizes="(min-width: 44rem) 44rem, 100vw"
        />
      </div>

      <section className="mt-10 border border-border border-dashed bg-surface/50 p-5" aria-labelledby="tldr-heading">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-2 w-2 flex-shrink-0 bg-accent" />
          <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">{BLOG.tldrEyebrow}</span>
        </div>
        <h2 id="tldr-heading" className="font-display text-text text-xl">
          {BLOG.tldrLabel}
        </h2>
        <p className="mt-3 text-base text-text leading-7">{post.tldr}</p>
      </section>

      <div className="mt-10 border-border border-t pt-2">
        <BlogMarkdown content={post.body} />
      </div>
    </article>
  );
}
