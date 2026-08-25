import Link from "next/link";
import { BLOG } from "@/lib/copy";
import type { BlogPost } from "@/lib/blog";
import { BlogCoverCredit, BlogCoverImage } from "./BlogCover";
import { BlogMeta } from "./BlogMeta";

function FeaturedStory({ post }: { post: BlogPost }) {
  return (
    <article className="md:grid md:grid-cols-12 md:items-start md:gap-x-14 lg:gap-x-16">
      <div className="md:col-span-6 lg:col-span-6">
        <BlogMeta post={post} />
        <h2 className="mt-4 font-display text-[2.35rem] text-text leading-[1.05] tracking-[-0.03em] md:text-[2.85rem] lg:text-[3.25rem]">
          <Link href={post.path}>{post.title}</Link>
        </h2>
        <p className="mt-5 max-w-[34rem] text-[1.125rem] text-text leading-[1.6]">{post.description}</p>
      </div>
      <figure className="mt-8 md:col-span-6 md:mt-0">
        <Link href={post.path} className="block">
          <BlogCoverImage
            post={post}
            priority
            aspectClassName="aspect-[4/5]"
            sizes="(min-width: 72rem) 34rem, (min-width: 48rem) 50vw, 100vw"
          />
        </Link>
        <figcaption>
          <BlogCoverCredit post={post} />
        </figcaption>
      </figure>
    </article>
  );
}

function StoryListItem({ post }: { post: BlogPost }) {
  return (
    <article className="border-border border-t py-8">
      <BlogMeta post={post} />
      <h2 className="mt-3 font-display text-[1.65rem] text-text leading-[1.12] tracking-[-0.02em] md:text-[1.95rem]">
        <Link href={post.path}>{post.title}</Link>
      </h2>
      <p className="mt-3 max-w-[40rem] text-[1.0625rem] text-text leading-[1.55]">{post.description}</p>
    </article>
  );
}

export function BlogIndex({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return <p className="py-16 text-[14px] text-text-muted">{BLOG.empty}</p>;
  }

  const [featured, ...rest] = posts;

  return (
    <div className="mt-14 md:mt-16">
      <FeaturedStory post={featured} />
      {rest.length > 0 ? (
        <div className="mt-20 max-w-[42rem]">
          {rest.map((post) => (
            <StoryListItem key={post.slug} post={post} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
