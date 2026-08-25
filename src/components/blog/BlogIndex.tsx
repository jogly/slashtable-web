import Link from "next/link";
import { BLOG } from "@/lib/copy";
import type { BlogPost } from "@/lib/blog";
import { formatEntryDate } from "@/lib/dates";
import { BlogCoverCredit, BlogCoverImage } from "./BlogCover";

function PostMeta({ post }: { post: BlogPost }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <time className="font-mono text-[10px] text-text-muted uppercase tracking-widest" dateTime={post.publishedAt}>
        {formatEntryDate(post.publishedAt)}
      </time>
      {post.tags.map((tag) => (
        <span key={tag} className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
          {tag}
        </span>
      ))}
    </div>
  );
}

function FeaturedStory({ post }: { post: BlogPost }) {
  return (
    <article className="group relative border-border border-t pt-12">
      <BlogCoverImage
        post={post}
        priority
        aspectClassName="aspect-[2/1]"
        sizes="(min-width: 68rem) 68rem, 100vw"
      />
      <BlogCoverCredit post={post} />
      <div className="mt-8 max-w-3xl">
        <PostMeta post={post} />
        <h2 className="mt-4 font-display text-4xl text-text leading-tight transition-colors group-hover:text-accent md:text-5xl lg:text-6xl">
          <Link href={post.path} className="after:absolute after:inset-0 after:z-[1]">
            {post.title}
          </Link>
        </h2>
        <p className="mt-5 text-base text-text-secondary leading-relaxed md:text-lg">{post.description}</p>
        <p className="mt-6 font-mono text-[11px] text-accent uppercase tracking-widest transition-colors group-hover:text-text">
          {BLOG.readPost} &rsaquo;
        </p>
      </div>
    </article>
  );
}

function EditorialRow({ post }: { post: BlogPost }) {
  return (
    <article className="group relative border-border border-t py-16">
      <div className="grid items-center gap-10 md:grid-cols-[minmax(0,0.48fr)_minmax(0,1fr)] md:gap-14">
        <div>
          <BlogCoverImage
            post={post}
            aspectClassName="aspect-[16/9] md:aspect-[4/3]"
            sizes="(min-width: 68rem) 32rem, 100vw"
          />
          <BlogCoverCredit post={post} />
        </div>
        <div>
          <PostMeta post={post} />
          <h2 className="mt-4 font-display text-3xl text-text leading-tight transition-colors group-hover:text-accent md:text-4xl">
            <Link href={post.path} className="after:absolute after:inset-0 after:z-[1]">
              {post.title}
            </Link>
          </h2>
          <p className="mt-4 text-sm text-text-secondary leading-relaxed md:text-base">{post.description}</p>
          <p className="mt-6 font-mono text-[11px] text-accent uppercase tracking-widest transition-colors group-hover:text-text">
            {BLOG.readPost} &rsaquo;
          </p>
        </div>
      </div>
    </article>
  );
}

export function BlogIndex({ posts }: { posts: BlogPost[] }) {
  const [featured, ...rest] = posts;

  if (!featured) {
    return <p className="py-16 font-mono text-[11px] text-text-muted uppercase tracking-widest">{BLOG.empty}</p>;
  }

  return (
    <div className="mt-16">
      <FeaturedStory post={featured} />
      {rest.map((post) => (
        <EditorialRow key={post.slug} post={post} />
      ))}
    </div>
  );
}
