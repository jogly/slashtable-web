import { JsonLd } from "@/components/seo/JsonLd";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { BLOG } from "@/lib/copy";
import { blogCollectionLd, getAllPosts } from "@/lib/blog";
import { breadcrumb, pageMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = pageMetadata({
  title: "Blog",
  description: BLOG.description,
  path: "/blog/",
});

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-content px-6 pt-32 pb-24 lg:px-8">
      <JsonLd data={breadcrumb([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog/" }])} />
      <JsonLd data={blogCollectionLd(posts)} />

      <header className="max-w-2xl">
        <div className="mb-5 flex items-center gap-2">
          <span className="h-2 w-2 flex-shrink-0 bg-accent" />
          <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">{BLOG.eyebrow}</span>
        </div>
        <h1 className="font-display text-5xl text-text leading-tight md:text-6xl">{BLOG.heading}</h1>
        <p className="mt-6 text-base text-text-secondary leading-relaxed md:text-lg">{BLOG.description}</p>
      </header>

      <BlogIndex posts={posts} />
    </div>
  );
}
