import { notFound } from "next/navigation";
import { BlogPostArticle } from "@/components/blog/BlogPostArticle";
import { JsonLd } from "@/components/seo/JsonLd";
import { blogPostingLd, getAllPosts, getPostBySlug } from "@/lib/blog";
import { articleMetadata, breadcrumb } from "@/lib/seo";

export const dynamic = "force-static";
// Workers preview has no incremental cache binding. OpenNext prerenders these
// slugs as SSG, then a cache miss 404s if dynamicParams is false. Allow the
// page to render from the embedded BLOG_SOURCES on miss. Files on the branch
// are the public set; merge to main is publish.
export const dynamicParams = true;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return articleMetadata({
    title: post.title,
    description: post.description,
    path: post.path,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    tags: post.tags,
    image: post.image,
    imageAlt: post.imageAlt,
    imageWidth: post.imageWidth,
    imageHeight: post.imageHeight,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-narrow px-6 pt-32 pb-20">
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog/" },
          { name: post.title, path: post.path },
        ])}
      />
      <JsonLd data={blogPostingLd(post)} />
      <BlogPostArticle post={post} />
    </div>
  );
}
