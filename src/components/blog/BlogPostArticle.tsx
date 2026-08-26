import type { BlogPost } from "@/lib/blog";
import { BlogDate } from "./BlogMeta";
import { BlogMarkdown } from "./BlogMarkdown";

export function BlogPostArticle({ post }: { post: BlogPost }) {
  return (
    <article>
      <header className="mb-10">
        <h1 className="scroll-mt-24 font-sans text-[2.75rem] text-text leading-[1.08] tracking-[-0.03em] md:text-5xl md:leading-[1.05]">
          {post.title}
        </h1>
        <div className="mt-5">
          <BlogDate publishedAt={post.publishedAt} updatedAt={post.updatedAt} />
        </div>
      </header>
      <BlogMarkdown content={post.body} />
    </article>
  );
}
