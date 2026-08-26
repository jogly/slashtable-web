import { PAGE_LINK_HEADER } from "@/lib/link-headers";
import { formatPostMarkdown, getAllPosts, getPostBySlug } from "@/lib/blog";
import { markdownNotFound } from "@/lib/markdown-negotiate";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const post = getPostBySlug(slug);
  if (!post) {
    return new Response(markdownNotFound(`/blog/${slug}`), {
      status: 404,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        Vary: "Accept",
        "Cache-Control": "public, max-age=60",
        Link: PAGE_LINK_HEADER,
      },
    });
  }

  return new Response(formatPostMarkdown(post), {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      Link: PAGE_LINK_HEADER,
    },
  });
}

export async function HEAD(request: Request, context: { params: Promise<{ slug: string }> }) {
  const res = await GET(request, context);
  return new Response(null, { status: res.status, headers: res.headers });
}
