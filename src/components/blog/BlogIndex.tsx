import Link from "next/link";
import { BLOG } from "@/lib/copy";
import type { BlogPost } from "@/lib/blog";
import { BlogCoverCredit, BlogCoverImage } from "./BlogCover";
import { BlogMeta } from "./BlogMeta";

function StoryRow({ post, showPhoto }: { post: BlogPost; showPhoto: boolean }) {
  return (
    <article className="border-border border-t py-8 first:border-t-0 first:pt-0">
      <BlogMeta post={post} />
      <h2 className="mt-3 font-display text-[1.65rem] text-text leading-[1.15] tracking-[-0.02em] md:text-[1.85rem]">
        <Link href={post.path}>{post.title}</Link>
      </h2>
      <p className="mt-3 text-[1.0625rem] text-text leading-[1.55]">{post.description}</p>
      {showPhoto ? (
        <figure className="mt-6">
          <Link href={post.path} className="block">
            <BlogCoverImage
              post={post}
              priority
              aspectClassName="aspect-[3/2]"
              sizes="(min-width: 40rem) 40rem, 100vw"
            />
          </Link>
          <figcaption>
            <BlogCoverCredit post={post} />
          </figcaption>
        </figure>
      ) : null}
    </article>
  );
}

export function BlogIndex({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return <p className="py-16 text-[14px] text-text-muted">{BLOG.empty}</p>;
  }

  const showPhoto = posts.length < 3;

  return (
    <div className="mt-10">
      {posts.map((post) => (
        <StoryRow key={post.slug} post={post} showPhoto={showPhoto} />
      ))}
    </div>
  );
}
