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
    <div className="mx-auto max-w-[52rem] px-6 pt-28 pb-28">
      <JsonLd data={breadcrumb([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog/" }])} />
      <JsonLd data={blogCollectionLd(posts)} />

      <header className="mx-auto max-w-[36rem] text-center">
        <h1 className="font-display text-[2.5rem] text-text leading-[1.1] tracking-[-0.03em] md:text-[3.25rem]">
          {BLOG.heading}
        </h1>
        <p className="mt-3 text-[16px] text-text-muted leading-6">{BLOG.description}</p>
      </header>

      <BlogIndex posts={posts} />
    </div>
  );
}
