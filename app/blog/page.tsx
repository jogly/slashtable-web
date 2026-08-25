import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { BLOG } from "@/lib/copy";
import { blogCollectionLd, getPublishedPosts } from "@/lib/blog";
import { formatEntryDate } from "@/lib/dates";
import { breadcrumb, pageMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = pageMetadata({
  title: "Blog",
  description: BLOG.description,
  path: "/blog/",
});

export default function BlogIndexPage() {
  const posts = getPublishedPosts();

  return (
    <div className="mx-auto max-w-narrow px-6 pt-32 pb-20">
      <JsonLd data={breadcrumb([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog/" }])} />
      <JsonLd data={blogCollectionLd(posts)} />

      <div className="mb-4 flex items-center gap-2">
        <span className="h-2 w-2 flex-shrink-0 bg-accent" />
        <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">{BLOG.eyebrow}</span>
      </div>
      <h1 className="font-display text-4xl text-text">{BLOG.heading}</h1>
      <p className="mt-4 text-sm text-text-secondary leading-relaxed">{BLOG.description}</p>

      <div className="mt-12 border-border border-t">
        {posts.length === 0 ? (
          <p className="py-10 font-mono text-[11px] text-text-muted uppercase tracking-widest">{BLOG.empty}</p>
        ) : (
          posts.map((post, i) => (
            <article
              key={post.slug}
              className={`relative py-10 ${i < posts.length - 1 ? "border-border border-b" : ""}`}
            >
              <div className="mb-3 flex flex-wrap items-baseline gap-3">
                <time
                  className="font-mono text-[10px] text-text-muted uppercase tracking-widest"
                  dateTime={post.publishedAt}
                >
                  {formatEntryDate(post.publishedAt)}
                </time>
                {post.tags.map((tag) => (
                  <span key={tag} className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="font-display text-text text-xl">
                <Link href={post.path} className="transition-colors hover:text-accent">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-3 text-sm text-text-secondary leading-relaxed">{post.description}</p>
              <p className="mt-4">
                <Link
                  href={post.path}
                  className="font-mono text-[11px] text-accent uppercase tracking-widest transition-colors hover:text-text"
                >
                  {BLOG.readPost} &rsaquo;
                </Link>
              </p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
