export const dynamic = "force-dynamic";

import { PRODUCT_LINK_HEADER } from "@/lib/link-headers";
import { methodNotAllowedProblem } from "@/lib/problem";


const PRODUCT = {
  name: "/table",
  alternateName: "slashtable",
  description:
    "Native desktop database client for product engineers. macOS and Linux (alpha). PostgreSQL, MySQL, SQLite, and Neon. Built-in MCP server for local, policy-scoped access to the user's connections.",
  kind: "local_desktop_app",
  platforms: [
    { os: "macos", arches: ["aarch64", "x86_64"], status: "ga" },
    { os: "linux", arches: ["amd64", "aarch64"], status: "alpha", note: "Debian/Ubuntu .deb" },
  ],
  engines: ["PostgreSQL", "MySQL", "SQLite", "Neon"],
  mcp: {
    transport: "stdio",
    location: "inside the installed desktop app",
    remoteUrl: null,
    setup:
      "Install /table, add a connection, enable MCP in Settings, then connect Claude Desktop, Claude Code, Cursor, or Windsurf over local stdio.",
    discovery: "https://www.slashtable.dev/.well-known/mcp.json",
    serverCard: "https://www.slashtable.dev/.well-known/mcp/server-card.json",
    agentSkills: "https://www.slashtable.dev/.well-known/agent-skills/index.json",
  },
  install: {
    oneLiner: "curl -fsSL https://slashtable.dev/install.sh | sh",
    downloadPage: "https://www.slashtable.dev/download/",
    homebrew: ["brew tap slashtable/cask", "brew install --cask slashtable"],
    manifests: {
      latest: "https://downloads.slashtable.dev/latest.json",
    },
  },
  links: {
    home: "https://www.slashtable.dev/",
    developers: "https://www.slashtable.dev/developers/",
    openapi: "https://www.slashtable.dev/openapi.json",
    llms: "https://www.slashtable.dev/llms.txt",
    apiCatalog: "https://www.slashtable.dev/.well-known/api-catalog",
    mcpDiscovery: "https://www.slashtable.dev/.well-known/mcp.json",
    mcpServerCard: "https://www.slashtable.dev/.well-known/mcp/server-card.json",
    about: "https://www.slashtable.dev/about/",
    contact: "https://www.slashtable.dev/contact/",
    pricing: "https://www.slashtable.dev/pricing/",
    changelog: "https://www.slashtable.dev/changelog/",
  },
} as const;

function rateLimitHeaders(): HeadersInit {
  const reset = Math.floor(Date.now() / 1000) + 3600;
  return {
    "RateLimit-Limit": "1000",
    "RateLimit-Remaining": "999",
    "RateLimit-Reset": String(reset),
    RateLimit: `limit=1000, remaining=999, reset=${reset}`,
  };
}

export function GET() {
  return Response.json(PRODUCT, {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      Link: PRODUCT_LINK_HEADER,
      ...rateLimitHeaders(),
    },
  });
}

function disallow(request: Request) {
  const instance = new URL(request.url).pathname;
  const res = methodNotAllowedProblem(instance, ["GET", "HEAD"]);
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(rateLimitHeaders())) {
    headers.set(k, String(v));
  }
  return new Response(res.body, { status: res.status, headers });
}

export function HEAD() {
  const res = GET();
  return new Response(null, { status: res.status, headers: res.headers });
}

export function POST(request: Request) {
  return disallow(request);
}
export function PUT(request: Request) {
  return disallow(request);
}
export function PATCH(request: Request) {
  return disallow(request);
}
export function DELETE(request: Request) {
  return disallow(request);
}
