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
- Pricing: https://www.slashtable.dev/pricing/
- Changelog: https://www.slashtable.dev/changelog/
`;

const PAGE_TITLES: Record<string, string> = {
  "/": "/table",
  "/download": "/table — Download",
  "/pricing": "/table — Pricing",
  "/changelog": "/table — Changelog",
  "/privacy": "/table — Privacy",
  "/terms": "/table — Terms",
};

export function markdownForPath(pathname: string): string | null {
  const key = normalizePath(pathname);
  const title = PAGE_TITLES[key];
  if (!title) return null;

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
  }

  return `# ${title}\n\n${SHARED_BODY}${extra}`;
}
