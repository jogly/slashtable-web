import Link from "next/link";
import { getPublishedPosts } from "@/lib/blog";

export const dynamic = "force-static";

const DISCORD = "https://discord.gg/xR2VdkfnJQ";

export default function DevelopersPage() {
  const posts = getPublishedPosts();

  return (
    <div className="mx-auto max-w-narrow px-6 pt-32 pb-20">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-2 w-2 flex-shrink-0 bg-accent" />
        <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">Developers</span>
      </div>
      <h1 className="font-display text-4xl text-text">Developer portal</h1>
      <p className="mt-4 text-sm text-text-secondary leading-relaxed">
        Public HTTP surfaces on this site are for agent and human discovery. /table itself is a local
        desktop database client. Database credentials and query execution stay on the machine where
        the app is installed.
      </p>

      <div className="mt-12 space-y-10 border-border border-t pt-10">
        <section>
          <h2 className="mb-3 font-display text-text text-xl">OpenAPI and product card</h2>
          <p className="mb-4 text-sm text-text-secondary leading-relaxed">
            The OpenAPI document describes the public website resources only: discovery docs and a
            small product card API. It is not a remote database API and it does not expose query
            endpoints.
          </p>
          <ul className="mb-4 space-y-2">
            <li className="flex items-start gap-2.5 text-sm text-text-secondary leading-relaxed">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-muted" />
              <span>
                OpenAPI:{" "}
                <a
                  href="https://www.slashtable.dev/openapi.json"
                  className="text-accent underline underline-offset-2 transition-colors hover:text-text"
                >
                  /openapi.json
                </a>
              </span>
            </li>
            <li className="flex items-start gap-2.5 text-sm text-text-secondary leading-relaxed">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-muted" />
              <span>
                Product card:{" "}
                <a
                  href="https://www.slashtable.dev/api/v1/product"
                  className="text-accent underline underline-offset-2 transition-colors hover:text-text"
                >
                  /api/v1/product
                </a>{" "}
                (JSON; includes IETF RateLimit-* response headers)
              </span>
            </li>
            <li className="flex items-start gap-2.5 text-sm text-text-secondary leading-relaxed">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-muted" />
              <span>
                API catalog:{" "}
                <a
                  href="https://www.slashtable.dev/.well-known/api-catalog"
                  className="text-accent underline underline-offset-2 transition-colors hover:text-text"
                >
                  /.well-known/api-catalog
                </a>
              </span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-display text-text text-xl">Agent brief (llms.txt)</h2>
          <p className="mb-4 text-sm text-text-secondary leading-relaxed">
            A markdown brief for agents covering install, local MCP setup, policy, and rules. Prefer
            this document when deciding whether /table fits a task.
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            <a
              href="https://www.slashtable.dev/llms.txt"
              className="text-accent underline underline-offset-2 transition-colors hover:text-text"
            >
              https://www.slashtable.dev/llms.txt
            </a>
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-text text-xl">MCP (local stdio only)</h2>
          <p className="mb-4 text-sm text-text-secondary leading-relaxed">
            MCP ships inside the installed desktop app and speaks stdio to Claude Desktop, Claude
            Code, Cursor, or Windsurf. There is no hosted MCP server and no remote MCP URL on this
            site. Do not invent one.
          </p>
          <ul className="mb-4 space-y-2">
            <li className="flex items-start gap-2.5 text-sm text-text-secondary leading-relaxed">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-muted" />
              <span>
                Server card:{" "}
                <a
                  href="https://www.slashtable.dev/.well-known/mcp/server-card.json"
                  className="text-accent underline underline-offset-2 transition-colors hover:text-text"
                >
                  /.well-known/mcp/server-card.json
                </a>
              </span>
            </li>
            <li className="flex items-start gap-2.5 text-sm text-text-secondary leading-relaxed">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-muted" />
              <span>
                Agent skills:{" "}
                <a
                  href="https://www.slashtable.dev/.well-known/agent-skills/index.json"
                  className="text-accent underline underline-offset-2 transition-colors hover:text-text"
                >
                  /.well-known/agent-skills/index.json
                </a>
              </span>
            </li>
          </ul>
          <ol className="mb-4 list-decimal space-y-2 pl-5 text-sm text-text-secondary leading-relaxed">
            <li>Install /table and open it.</li>
            <li>Add a database connection (credentials stay on the machine).</li>
            <li>Enable the MCP server in Settings.</li>
            <li>Connect the IDE or agent client over local stdio.</li>
          </ol>
        </section>

        <section>
          <h2 className="mb-3 font-display text-text text-xl">Blog</h2>
          <p className="mb-4 text-sm text-text-secondary leading-relaxed">
            Engineering notes for local MCP setup, foreign-key navigation, and scoped schema graphs.
            The index lists published posts only. Drafts stay off the public URL until a human sets
            published to true.
          </p>
          <ul className="mb-4 space-y-2">
            <li className="flex items-start gap-2.5 text-sm text-text-secondary leading-relaxed">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-muted" />
              <span>
                Index:{" "}
                <Link href="/blog" className="text-accent underline underline-offset-2 transition-colors hover:text-text">
                  /blog
                </Link>
              </span>
            </li>
            {posts.map((post) => (
              <li key={post.slug} className="flex items-start gap-2.5 text-sm text-text-secondary leading-relaxed">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-muted" />
                <span>
                  {post.title}:{" "}
                  <Link href={post.path} className="text-accent underline underline-offset-2 transition-colors hover:text-text">
                    {post.path}
                  </Link>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-display text-text text-xl">Install</h2>
          <p className="mb-4 text-sm text-text-secondary leading-relaxed">
            macOS and Linux (alpha) builds are on the download page. Homebrew and a one-liner install
            script are also available.
          </p>
          <ul className="mb-4 space-y-2">
            <li className="flex items-start gap-2.5 text-sm text-text-secondary leading-relaxed">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-muted" />
              <span>
                Download:{" "}
                <Link href="/download" className="text-accent underline underline-offset-2 transition-colors hover:text-text">
                  /download
                </Link>
              </span>
            </li>
            <li className="flex items-start gap-2.5 text-sm text-text-secondary leading-relaxed">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-muted" />
              <span>
                One-liner:{" "}
                <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-text text-xs">
                  curl -fsSL https://slashtable.dev/install.sh | sh
                </code>
              </span>
            </li>
            <li className="flex items-start gap-2.5 text-sm text-text-secondary leading-relaxed">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-muted" />
              <span>
                Manifest:{" "}
                <a
                  href="https://downloads.slashtable.dev/latest.json"
                  className="text-accent underline underline-offset-2 transition-colors hover:text-text"
                >
                  downloads.slashtable.dev/latest.json
                </a>
              </span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-display text-text text-xl">Support</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Questions about integrating agents or reporting install issues: join Discord (
            <a href={DISCORD} className="text-accent underline underline-offset-2 transition-colors hover:text-text">
              discord.gg/xR2VdkfnJQ
            </a>
            ) or see the{" "}
            <Link href="/contact" className="text-accent underline underline-offset-2 transition-colors hover:text-text">
              contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
