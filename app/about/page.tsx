import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-narrow px-6 pt-32 pb-20">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-2 w-2 flex-shrink-0 bg-accent" />
        <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">Company</span>
      </div>
      <h1 className="font-display text-4xl text-text">About</h1>

      <div className="mt-12 space-y-6 border-border border-t pt-10">
        <p className="text-sm text-text-secondary leading-relaxed">
          Make Toast LLC builds /table, a native desktop database client for product engineers.
          The product focuses on foreign-key navigation, scoped schema diagrams, a TypeScript plugin
          system, and a built-in MCP server so agents can work against the connections already on
          the machine.
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">
          /table runs locally on macOS and Linux (alpha). Supported engines include PostgreSQL,
          MySQL, SQLite, and Neon. There is no hosted database on this website and no remote query
          API. Agents reach data only through the MCP server that ships inside the installed app,
          over stdio, under per-connection policy (hidden, read, or write).
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">
          Individual plans are one-time purchases. Updates stay free on every plan. Team licensing
          is available for organizations that need centralized seat management and shared connection
          libraries. Pricing details live on the{" "}
          <Link href="/pricing" className="text-accent underline underline-offset-2 transition-colors hover:text-text">
            pricing page
          </Link>
          .
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">
          Product direction, release notes, and community discussion happen in public channels.
          Join Discord for bugs and feature debates, or follow release notes on X. Trust and legal
          documents are published on this site under Privacy and Terms.
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">
          For installers and architecture-specific builds, use the{" "}
          <Link href="/download" className="text-accent underline underline-offset-2 transition-colors hover:text-text">
            download page
          </Link>
          . For agent and API discovery documents, see the{" "}
          <Link href="/developers" className="text-accent underline underline-offset-2 transition-colors hover:text-text">
            developers portal
          </Link>
          .
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">
          Make Toast LLC publishes /table from this domain (www.slashtable.dev). The Mac bundle
          filename is SlashTable.app; the product name in user-facing text is /table.
        </p>
      </div>
    </div>
  );
}
