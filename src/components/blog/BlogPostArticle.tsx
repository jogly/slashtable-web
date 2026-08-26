import type { BlogPost } from "@/lib/blog";
import { BlogMarkdown } from "./BlogMarkdown";
import { BlogMeta } from "./BlogMeta";

export function BlogPostArticle({ post }: { post: BlogPost }) {
  return (
    <article>
      <h1 className="font-display text-[2.4rem] text-text leading-[1.08] tracking-[-0.025em] md:text-5xl md:leading-[1.05]">
        {post.title}
      </h1>
      <p className="mt-4 text-[1.05rem] leading-[1.45] text-text-muted md:text-[1.125rem] md:leading-[1.45]">
        {post.description}
      </p>
      <div className="mt-5">
        <BlogMeta post={post} />
      </div>
      <div className="mt-10">
        <BlogMarkdown content={post.body} />
      </div>
    </article>
  );
}
