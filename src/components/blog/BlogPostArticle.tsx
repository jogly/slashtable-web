import type { BlogPost } from "@/lib/blog";
import { BlogDate } from "./BlogMeta";
import { BlogMarkdown } from "./BlogMarkdown";

export function BlogPostArticle({ post }: { post: BlogPost }) {
  return (
    <article>
      <header>
        <h1 className="font-display text-[2.75rem] text-text leading-[1.08] tracking-[-0.03em] md:text-5xl md:leading-[1.05]">
          {post.title}
        </h1>
        <div className="mt-5">
          <BlogDate publishedAt={post.publishedAt} updatedAt={post.updatedAt} />
        </div>
        <hr className="mt-6 mb-10 border-0 border-border border-t" />
      </header>
      <BlogMarkdown content={post.body} />
    </article>
  );
}
