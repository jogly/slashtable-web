import { NextResponse, type NextRequest } from "next/server";
import {
  isMarkdownPath,
  markdownForPath,
  mergeVary,
  prefersMarkdown,
} from "@/lib/markdown-negotiate";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static agent docs and assets: never negotiate away from the file.
  if (
    pathname === "/llms.txt" ||
    pathname === "/openapi.json" ||
    pathname === "/install.sh" ||
    pathname.startsWith("/.well-known/") ||
    pathname.startsWith("/api/")
  ) {
    return NextResponse.next();
  }

  if (isMarkdownPath(pathname) && prefersMarkdown(request.headers.get("accept"))) {
    const body = markdownForPath(pathname);
    if (body) {
      return new NextResponse(body, {
        status: 200,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          Vary: "Accept",
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        },
      });
    }
  }

  const res = NextResponse.next();
  if (isMarkdownPath(pathname)) {
    res.headers.set("Vary", mergeVary(res.headers.get("Vary"), "Accept"));
  }
  return res;
}

export const config = {
  matcher: [
    "/",
    "/download",
    "/download/",
    "/pricing",
    "/pricing/",
    "/changelog",
    "/changelog/",
    "/privacy",
    "/privacy/",
    "/terms",
    "/terms/",
  ],
};
