/** Pure Accept negotiation + markdown bodies for key marketing pages. */

export type AcceptEntry = { type: string; q: number; specificity: number };

const PRODUCES = ["text/html", "text/markdown"] as const;

export const MARKDOWN_PATHS = new Set([
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
  "/developers",
  "/developers/",
  "/about",
  "/about/",
  "/contact",
  "/contact/",
]);

export function normalizePath(pathname: string): string {
  if (pathname === "") return "/";
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

export function isMarkdownPath(pathname: string): boolean {
  return MARKDOWN_PATHS.has(pathname) || MARKDOWN_PATHS.has(normalizePath(pathname));
}

/** Paths that should not be Accept-negotiated (static/API/assets). */
export function shouldSkipMarkdownNegotiation(pathname: string): boolean {
  if (
    pathname === "/llms.txt" ||
    pathname === "/openapi.json" ||
    pathname === "/install.sh" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/favicon.png" ||
    pathname === "/favicon.ico" ||
    pathname === "/og-image.png"
  ) {
    return true;
  }
  if (pathname.startsWith("/.well-known/")) return true;
  if (pathname.startsWith("/api/")) return true;
  if (pathname.startsWith("/_next/")) return true;
  // Static file-looking paths (assets under public/)
  if (/\.[a-zA-Z0-9]{1,8}$/.test(pathname)) return true;
  return false;
}

export function parseAccept(header: string): AcceptEntry[] {
  return header.split(",").map((raw) => {
    const parts = raw
      .trim()
      .split(";")
      .map((s) => s.trim());
    const type = (parts[0] ?? "*/*").toLowerCase();
    let q = 1;
    for (const param of parts.slice(1)) {
      const [name, value] = param.split("=").map((s) => s.trim());
      if (name === "q") {
        const parsed = Number(value);
        if (!Number.isNaN(parsed)) q = Math.max(0, Math.min(1, parsed));
      }
    }
    const specificity = type === "*/*" ? 0 : type.endsWith("/*") ? 1 : 2;
    return { type, q, specificity };
  });
}

function matches(entry: AcceptEntry, candidate: string): boolean {
  if (entry.type === "*/*") return true;
  if (entry.type.endsWith("/*")) {
    return candidate.startsWith(entry.type.slice(0, -1));
  }
  return entry.type === candidate;
}

/** Returns preferred representation among html/markdown, or null if none acceptable. */
export function preferredType(header: string | null): (typeof PRODUCES)[number] | null {
  if (!header) return "text/html";
  const entries = parseAccept(header);
  if (entries.length === 0) return "text/html";

  let bestType: (typeof PRODUCES)[number] | null = null;
  let bestQ = -1;
  let bestPosition = Infinity;

  for (const candidate of PRODUCES) {
    let matched: AcceptEntry | null = null;
    let matchedPosition = Infinity;
    for (let idx = 0; idx < entries.length; idx++) {
      const e = entries[idx]!;
      if (!matches(e, candidate)) continue;
      if (
        matched === null ||
        e.specificity > matched.specificity ||
        (e.specificity === matched.specificity && idx < matchedPosition)
      ) {
        matched = e;
        matchedPosition = idx;
      }
    }
    if (matched === null) continue;
    if (matched.q <= 0) continue;

    if (matched.q > bestQ || (matched.q === bestQ && matchedPosition < bestPosition)) {
      bestQ = matched.q;
      bestPosition = matchedPosition;
      bestType = candidate;
    }
  }

  return bestType;
}

export function prefersMarkdown(accept: string | null): boolean {
  return preferredType(accept) === "text/markdown";
}

export function mergeVary(existing: string | null | undefined, value: string): string {
  if (!existing || existing.trim() === "") return value;
  const tokens = existing.split(",").map((s) => s.trim().toLowerCase());
  if (tokens.includes(value.toLowerCase())) return existing;
  return `${existing}, ${value}`;
}

const HOMEPAGE_BODY = `Native desktop database client for product engineers. Platforms: macOS and Linux (alpha). Engines: PostgreSQL, MySQL, SQLite, and Neon.

/table is a local app. Agents reach data only through the MCP server that runs inside the installed app, over stdio. There is no hosted database and no remote query API on this site. Credentials stay on the machine.

## Built for product engineers

/table is a buy-once native client for exploring and editing databases while giving AI agents controlled, local access. The website publishes discovery documents and a small product card API. Database work happens in the installed desktop app, not over this domain.

### Click through your data

Graph navigation for foreign keys, reverse FKs, and join tables.

### Connects to where you work

Docker containers, Neon branches, SSH-tunneled prod, and SQLite files.

### Screenshot-worthy schema diagrams

Scoped ER diagrams that match your mental model.

## Parallel development is the new normal.

Docker compose auto-detect, Neon branch sync, first-class SSH tunneling, multi-database tabs on one connection, and credential vaults (Keychain, 1Password; others in alpha).

### Docker auto-detect

Detects running Postgres and MySQL containers, reads creds from their env, and groups them by docker-compose project.

### Neon branch sync

Paste a Neon API key. Every project and branch shows up automatically.

### Multi-database, one connection

Flip between every database on the server. Each one keeps its own tabs.

### First-class SSH tunneling

Production behind a bastion is a normal connection.

### From the terminal you're in

\`slashtable postgres://...\` opens the app on that connection.

### Credentials where they already live

macOS Keychain, 1Password, Bitwarden, AWS Secrets Manager, HashiCorp Vault.

## Bidirectional FK navigation.

Click through PostgreSQL and MySQL relationships instead of writing join SQL by hand. Breadcrumb trails keep context as you walk the graph. Reverse FK lookups and join-table collapse keep navigation readable.

### Beautiful ER diagrams without noise.

Generate interactive ER diagrams from a starting table. Pin roots, control depth, and hide noise so scoped graphs stay readable for agents and humans.

## Bring Your Own Code.

Extend the app with a TypeScript plugin system under \`~/.slashtable/plugins/\`. Cell renderers, enrichers, views, query hooks, toolbar actions, and themes stay close to the data without leaving the native client.

### Cell renderers change how columns look

### Record enrichers attach external data to rows

### Custom views add new tab types

### Query hooks intercept SQL

### Toolbar actions wire into the active connection

## Controlled access for AI agents.

Local stdio MCP server ships inside the desktop app. Credentials never leave the machine. Do not invent a remote MCP endpoint for this product.

### Battle-tested guardrails

### Schema introspection

### Per-connection access

## Everything else.

SQL editor, multi-statement timing, vault integrations, and the rest of the client surface area on every plan.

### SQL editor

### Filter from the keyboard

### Saved favorites

### Array & JSON cell editors

### Safe data mutations

### Schema-aware grid

### Virtual scrolling

### Schema graph, scoped

### Prefix grouping

### Customizable keybindings

### Connection paint

### Connection organization

### Tab workspaces per connection

### Command palette

### Semantic column types

### SQL execution logging

### Regret-driven development

### And more...

## /table.app

### macOS downloads

### Linux downloads (alpha)

- One-liner: \`curl -fsSL https://slashtable.dev/install.sh | sh\`
- Direct downloads: https://www.slashtable.dev/download/
- Homebrew: \`brew tap slashtable/cask\` then \`brew install --cask slashtable\`
- Release manifest: https://downloads.slashtable.dev/latest.json

## Build with us

Come watch, or come help. Discord and X for bug reports, feature debates, and ORM hot takes.

### Discord

### Twitter / X

## When to use

- Explore local or remote Postgres, MySQL, SQLite, or Neon with an agent over MCP
- Walk foreign keys and request a scoped schema graph from a starting table
- Give an agent policy-scoped database access without exposing a hosted endpoint
- Prefer the desktop app for query and edit workflows; use this site for install, pricing, and agent discovery docs

## Developer docs

Public HTTP surfaces on this site are discovery-only. Full developer portal: https://www.slashtable.dev/developers/

- OpenAPI: https://www.slashtable.dev/openapi.json
- Product card: https://www.slashtable.dev/api/v1/product
- llms.txt: https://www.slashtable.dev/llms.txt
- API catalog: https://www.slashtable.dev/.well-known/api-catalog

## Company

- About: https://www.slashtable.dev/about/
- Contact: https://www.slashtable.dev/contact/
- Privacy: https://www.slashtable.dev/privacy/
- Terms: https://www.slashtable.dev/terms/
- Discord: https://discord.gg/xR2VdkfnJQ

## Links

- Home: https://www.slashtable.dev/
- Download: https://www.slashtable.dev/download/
- Pricing: https://www.slashtable.dev/pricing/
- Changelog: https://www.slashtable.dev/changelog/
- Developers: https://www.slashtable.dev/developers/
`;

const SHARED_BODY = `Native desktop database client for product engineers. Platforms: macOS and Linux (alpha). Engines: PostgreSQL, MySQL, SQLite, and Neon.

/table is a local app. Agents reach data only through the MCP server that runs inside the installed app, over stdio. There is no hosted database and no remote query API on this site.

## Install

- One-liner: \`curl -fsSL https://slashtable.dev/install.sh | sh\`
- Direct downloads: https://www.slashtable.dev/download/
- Homebrew: \`brew tap slashtable/cask\` then \`brew install --cask slashtable\`

## MCP (local stdio)

1. Install /table and open it.
2. Add a database connection (credentials stay on the machine).
3. Enable the MCP server in Settings.
4. Connect Claude Desktop, Claude Code, Cursor, or Windsurf over local stdio.

Per-connection policy: hidden, read, or write. Read uses a keyword filter plus an engine-level READ ONLY transaction that rolls back. Hidden connections are invisible to the agent.

## When to use

- Explore local or remote Postgres, MySQL, SQLite, or Neon with an agent over MCP
- Walk foreign keys and request a scoped schema graph from a starting table
- Give an agent policy-scoped database access without exposing a hosted endpoint

## Links

- OpenAPI: https://www.slashtable.dev/openapi.json
- Product card: https://www.slashtable.dev/api/v1/product
- llms.txt: https://www.slashtable.dev/llms.txt
- Developers: https://www.slashtable.dev/developers/
- About: https://www.slashtable.dev/about/
- Contact: https://www.slashtable.dev/contact/
- Pricing: https://www.slashtable.dev/pricing/
- Changelog: https://www.slashtable.dev/changelog/
`;

const PAGE_TITLES: Record<string, string> = {
  "/": "/table",
  "/download": "/table - Download",
  "/pricing": "/table - Pricing",
  "/changelog": "/table - Changelog",
  "/privacy": "/table - Privacy",
  "/terms": "/table - Terms",
  "/developers": "/table - Developers",
  "/about": "/table - About",
  "/contact": "/table - Contact",
};

export function markdownForPath(pathname: string): string | null {
  const key = normalizePath(pathname);
  const title = PAGE_TITLES[key];
  if (!title) return null;

  if (key === "/") {
    return `# ${title}\n\n${HOMEPAGE_BODY}`;
  }

  let extra = "";
  if (key === "/download") {
    extra = `\n## This page\n\nMac .dmg (aarch64 / x86_64) and Linux .deb (amd64 / aarch64, alpha). Manifest: https://downloads.slashtable.dev/latest.json\n`;
  } else if (key === "/pricing") {
    extra = `\n## This page\n\nFree, Personal ($49), and Pro ($99). Buy once. Details and checkout live on this URL as HTML for browsers.\n`;
  } else if (key === "/changelog") {
    extra = `\n## This page\n\nRelease notes for the desktop app. Prefer the HTML view for the full formatted history.\n`;
  } else if (key === "/privacy") {
    extra = `\n## This page\n\nPrivacy policy for the /table product and this website.\n`;
  } else if (key === "/terms") {
    extra = `\n## This page\n\nTerms of use for the /table product and this website.\n`;
  } else if (key === "/developers") {
    extra = `\n## This page\n\nDeveloper portal for public discovery docs: OpenAPI, llms.txt, product card, local MCP server card, and install. MCP is local stdio inside the desktop app; there is no remote MCP URL.\n`;
  } else if (key === "/about") {
    extra = `\n## This page\n\nAbout Make Toast LLC and the /table desktop database client.\n`;
  } else if (key === "/contact") {
    extra = `\n## This page\n\nHow to reach the /table team via Discord or sales email.\n`;
  }

  return `# ${title}\n\n${SHARED_BODY}${extra}`;
}

/** Helpful markdown body for unknown paths when Accept prefers text/markdown. */
export function markdownNotFound(pathname: string): string {
  const path = pathname || "/";
  return `# Not found

No page at \`${path}\`.

## Try these

- Home: https://www.slashtable.dev/
- Agent guide: https://www.slashtable.dev/llms.txt
- OpenAPI: https://www.slashtable.dev/openapi.json
- Product card: https://www.slashtable.dev/api/v1/product
- Download: https://www.slashtable.dev/download/
`;
}
