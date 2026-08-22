import { NextResponse, type NextRequest } from "next/server";
import { PAGE_LINK_HEADER } from "@/lib/link-headers";
import {
  isMarkdownPath,
  markdownForPath,
  markdownNotFound,
  mergeVary,
  prefersMarkdown,
  shouldSkipMarkdownNegotiation,
} from "@/lib/markdown-negotiate";

function withPageLinks(res: NextResponse): NextResponse {
  res.headers.set("Link", PAGE_LINK_HEADER);
  return res;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accept = request.headers.get("accept");

  // Static agent docs, API, and assets: never negotiate away from the file.
  if (shouldSkipMarkdownNegotiation(pathname)) {
    return NextResponse.next();
  }

  if (prefersMarkdown(accept)) {
    if (isMarkdownPath(pathname)) {
      const body = markdownForPath(pathname);
      if (body) {
        return withPageLinks(
          new NextResponse(body, {
            status: 200,
            headers: {
              "Content-Type": "text/markdown; charset=utf-8",
              Vary: "Accept",
              "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
            },
          }),
        );
      }
    }

    // Unknown paths: agent-friendly markdown 404 (Ora content negotiation).
    return withPageLinks(
      new NextResponse(markdownNotFound(pathname), {
        status: 404,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          Vary: "Accept",
          "Cache-Control": "public, max-age=60",
        },
      }),
    );
  }

  const res = NextResponse.next();
  if (isMarkdownPath(pathname)) {
    res.headers.set("Vary", mergeVary(res.headers.get("Vary"), "Accept"));
    withPageLinks(res);
  }
  return res;
}

export const config = {
  matcher: [
    /*
     * Negotiate markdown + attach Link headers on HTML routes.
     * Skip Next internals and common static assets (also gated in shouldSkip…).
     */
    "/((?!_next/static|_next/image|_next/data).*)",
    "/",
  ],
};
