/**
 * Compact SSR product summary for crawlers that score text/HTML density
 * and nested heading outlines. Keep markup minimal: no SVG, few wrappers.
 */
export function HomeProductArticle() {
  return (
    <article className="mx-auto max-w-2xl px-6 py-10 text-text">
      <h2 className="font-display text-2xl">What /table is</h2>
      <p className="mt-3 text-sm text-text-secondary leading-relaxed">
        /table is a native desktop database client for product engineers. It
        connects to PostgreSQL, MySQL, SQLite, and Neon on macOS, with Linux in
        alpha. The app stays local: credentials never leave the machine, and
        there is no hosted database or remote query API on this site.
      </p>
      <p className="mt-3 text-sm text-text-secondary leading-relaxed">
        Buy once for a perpetual license. Use it to explore and edit data,
        walk foreign keys, generate scoped schema diagrams, and give AI agents
        controlled access through a local MCP server over stdio. The SQL editor,
        schema-aware grid, and virtual scrolling cover day-to-day query work
        without switching tools.
      </p>

      <h2 className="mt-8 font-display text-2xl">Explore data by relationships</h2>
      <p className="mt-3 text-sm text-text-secondary leading-relaxed">
        Product work usually means following how rows relate, not writing join
        SQL by hand. /table treats foreign keys as first-class navigation so
        the path through the schema matches how the product is modeled. That
        matters when shipping features against real Postgres and MySQL schemas
        instead of toy tables.
      </p>
      <h3 className="mt-5 font-display text-xl">Click through foreign keys</h3>
      <p className="mt-2 text-sm text-text-secondary leading-relaxed">
        Open a row, follow outbound and reverse foreign keys, and cross join
        tables without leaving the grid. Breadcrumbs keep the trail visible
        while the editor stays ready for inserts, updates, and deletes. Safe
        mutations and favorites keep repeated paths close at hand.
      </p>
      <h3 className="mt-5 font-display text-xl">Scoped ER diagrams</h3>
      <p className="mt-2 text-sm text-text-secondary leading-relaxed">
        Start from a table, pin roots, control depth, and hide noise. The
        diagram stays close to the mental model instead of dumping every edge
        in the database. Search by name when the graph gets wide.
      </p>

      <h2 className="mt-8 font-display text-2xl">Connect where work already happens</h2>
      <p className="mt-3 text-sm text-text-secondary leading-relaxed">
        Parallel development means Docker compose stacks, Neon branches,
        SSH-tunneled prod, and local SQLite files. /table auto-detects common
        setups, keeps multi-database tabs on one connection, and reads
        credentials from Keychain, 1Password, AWS Secrets Manager, and
        HashiCorp Vault when those are already in use.
      </p>

      <h2 className="mt-8 font-display text-2xl">Agents on a local MCP server</h2>
      <p className="mt-3 text-sm text-text-secondary leading-relaxed">
        The MCP server ships inside the installed app and speaks stdio to
        Claude Desktop, Claude Code, Cursor, or Windsurf. Agents reach schema
        and data only through that local process. Every call can be reviewed in
        the MCP log with method, tool, connection, and duration.
      </p>
      <h3 className="mt-5 font-display text-xl">Per-connection policy</h3>
      <p className="mt-2 text-sm text-text-secondary leading-relaxed">
        Mark a connection hidden, read, or write. Read mode combines a
        statement keyword filter with an engine-level READ ONLY transaction
        that always rolls back, including sneaky CTE writes. Prod can stay
        invisible to the agent while local and branch databases stay usable.
      </p>
      <h3 className="mt-5 font-display text-xl">Plugins in TypeScript</h3>
      <p className="mt-2 text-sm text-text-secondary leading-relaxed">
        Drop TypeScript into ~/.slashtable/plugins/ for cell renderers, record
        enrichers, custom views, query hooks, and toolbar actions. Extend the
        client without waiting on a release cycle, using the same language
        already in the product stack.
      </p>

      <h2 className="mt-8 font-display text-2xl">Install</h2>
      <p className="mt-3 text-sm text-text-secondary leading-relaxed">
        Download for macOS or Linux (alpha), run
        curl -fsSL https://slashtable.dev/install.sh | sh, or install with
        Homebrew. Pricing, changelog, OpenAPI, developers docs, and llms.txt
        live on this site for humans and agents alike.
      </p>
    </article>
  );
}
