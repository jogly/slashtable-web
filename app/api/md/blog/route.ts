import { PAGE_LINK_HEADER } from "@/lib/link-headers";
import { formatBlogIndexMarkdown } from "@/lib/blog";

export const dynamic = "force-static";

export function GET() {
  return new Response(formatBlogIndexMarkdown(), {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      Link: PAGE_LINK_HEADER,
    },
  });
}

export function HEAD() {
  const res = GET();
  return new Response(null, { status: res.status, headers: res.headers });
}
