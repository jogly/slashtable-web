import { BLOG } from "@/lib/copy";
import type { BlogPost } from "@/lib/blog";
import { BlogCover } from "./BlogCover";
import { BlogMarkdown } from "./BlogMarkdown";
import { BlogMeta } from "./BlogMeta";

export function BlogPostArticle({ post }: { post: BlogPost }) {
  return (
    <article>
      <h1 className="font-display text-[2.6rem] text-text leading-[1.06] tracking-[-0.025em] md:text-5xl md:leading-[1.05]">
        {post.title}
      </h1>
      <div className="mt-6">
        <BlogMeta post={post} showTags />
      </div>

      <div className="mt-10">
        <BlogCover
          post={post}
          priority
          aspectClassName="aspect-[3/2]"
          sizes="(min-width: 40rem) 40rem, 100vw"
        />
      </div>

      <aside className="mt-12 mb-2 border-border border-l pl-5" aria-label={BLOG.tldrLabel}>
        <p className="font-display text-[1.05rem] text-text italic">{BLOG.tldrLabel}</p>
        <p className="mt-3 text-[1.125rem] leading-[1.7] text-text">{post.tldr}</p>
      </aside>

      <div className="mt-10">
        <BlogMarkdown content={post.body} />
      </div>
    </article>
  );
}
