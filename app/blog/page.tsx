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
    <div className="mx-auto max-w-[72rem] px-6 pt-28 pb-32 lg:px-10">
      <JsonLd data={breadcrumb([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog/" }])} />
      <JsonLd data={blogCollectionLd(posts)} />

      <header className="max-w-[36rem]">
        <h1 className="font-display text-6xl text-text leading-none tracking-[-0.035em] md:text-7xl">
          {BLOG.heading}
        </h1>
        <p className="mt-5 text-[1.0625rem] text-text leading-[1.6]">{BLOG.description}</p>
      </header>

      <BlogIndex posts={posts} />
    </div>
  );
}
