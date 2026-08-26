import { CATALOG_LINK_HEADER } from "@/lib/link-headers";
import { buildLlmsTxt } from "@/lib/llms";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsTxt(), {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      Link: CATALOG_LINK_HEADER,
    },
  });
}

export function HEAD() {
  const res = GET();
  return new Response(null, { status: res.status, headers: res.headers });
}
