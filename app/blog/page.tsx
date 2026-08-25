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
    <div className="mx-auto max-w-[42rem] px-6 pt-32 pb-28">
      <JsonLd data={breadcrumb([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog/" }])} />
      <JsonLd data={blogCollectionLd(posts)} />

      <header>
        <h1 className="font-display text-[3rem] text-text leading-[1.04] tracking-[-0.03em] md:text-6xl">
          {BLOG.heading}
        </h1>
        <p className="mt-5 max-w-[34rem] font-display text-[1.2rem] text-text italic leading-[1.4]">{BLOG.description}</p>
      </header>

      <BlogIndex posts={posts} />
    </div>
  );
}
