import { BLOG } from "@/lib/copy";
import type { BlogPost } from "@/lib/blog";
import { BlogLeaderRow } from "./BlogLeaderRow";

export function BlogIndex({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return <p className="mt-8 text-[14px] text-text-muted">{BLOG.empty}</p>;
  }

  return (
    <div className="mt-8">
      {posts.map((post) => (
        <BlogLeaderRow key={post.slug} href={post.path} title={post.title} publishedAt={post.publishedAt} />
      ))}
    </div>
  );
}
