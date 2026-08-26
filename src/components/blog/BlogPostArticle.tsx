import type { BlogPost } from "@/lib/blog";
import { BlogCover } from "./BlogCover";
import { BlogMarkdown } from "./BlogMarkdown";
import { BlogMeta } from "./BlogMeta";

export function BlogPostArticle({ post }: { post: BlogPost }) {
  return (
    <article>
      <h1 className="font-display text-[2.4rem] text-text leading-[1.08] tracking-[-0.025em] md:text-5xl md:leading-[1.05]">
        {post.title}
      </h1>
      <div className="mt-5">
        <BlogMeta post={post} showTags />
      </div>
      <p className="mt-6 text-[1.125rem] leading-[1.7] text-text">{post.description}</p>

      <div className="mt-8">
        <BlogCover
          post={post}
          priority
          aspectClassName="aspect-[3/2]"
          sizes="(min-width: 40rem) 40rem, 100vw"
        />
      </div>

      <div className="mt-10">
        <BlogMarkdown content={post.body} />
      </div>
    </article>
  );
}
