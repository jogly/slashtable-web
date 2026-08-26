import type { BlogPost } from "@/lib/blog";
import { BlogMarkdown } from "./BlogMarkdown";
import { BlogDate } from "./BlogMeta";

export function BlogPostArticle({ post }: { post: BlogPost }) {
  return (
    <article>
      <h1 className="font-display text-[2.4rem] text-text leading-[1.08] tracking-[-0.025em] md:text-5xl md:leading-[1.05]">
        {post.title}
      </h1>
      <div className="mt-5">
        <BlogDate publishedAt={post.publishedAt} updatedAt={post.updatedAt} />
      </div>
      <hr className="mt-6 mb-10 border-0 border-border border-t" />
      <BlogMarkdown content={post.body} />
    </article>
  );
}
