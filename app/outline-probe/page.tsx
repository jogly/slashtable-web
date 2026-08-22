export default function OutlineProbePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-text">
      <h1 className="font-display text-4xl text-text">Outline probe for agent extractors</h1>
      <p className="mt-4 text-text-secondary leading-relaxed">
        This page exists so content extractors can score a never-seen URL with a nested heading
        outline. It is not marketing copy for the product. The body is long enough for crawlers
        that require hundreds of characters of server-rendered text alongside an H1 and nested
        section headings. Parallel development workflows, bidirectional foreign-key navigation,
        schema graphs, plugin hooks, and local stdio MCP access are named only as outline anchors.
      </p>

      <h2 className="mt-10 font-display text-2xl text-text">Connect and explore data</h2>
      <p className="mt-3 text-text-secondary leading-relaxed">
        Product engineers keep many environments open at once. Containers, branches, tunnels, and
        local files should appear as ordinary connections without ceremony.
      </p>
      <h3 className="mt-6 font-display text-xl text-text">Docker and branch sync</h3>
      <p className="mt-2 text-text-secondary leading-relaxed">
        Auto-detect running database containers and sync hosted branches so the sidebar matches the
        workspace you already have open.
      </p>
      <h3 className="mt-6 font-display text-xl text-text">SSH tunnels and vaults</h3>
      <p className="mt-2 text-text-secondary leading-relaxed">
        Production behind a bastion and credentials in Keychain or 1Password stay local to the
        machine. Nothing is posted to a hosted query API.
      </p>

      <h2 className="mt-10 font-display text-2xl text-text">Navigate schema relationships</h2>
      <p className="mt-3 text-text-secondary leading-relaxed">
        Click through foreign keys and reverse lookups with breadcrumbs instead of hand-written
        join SQL. Scoped graphs stay readable when depth and roots are under control.
      </p>
      <h3 className="mt-6 font-display text-xl text-text">Bidirectional FK trails</h3>
      <p className="mt-2 text-text-secondary leading-relaxed">
        Drill into related rows and climb back through the trail. Join tables collapse so navigation
        stays clean for humans and agents.
      </p>
      <h3 className="mt-6 font-display text-xl text-text">Scoped ER diagrams</h3>
      <p className="mt-2 text-text-secondary leading-relaxed">
        Start from one table, pin roots, hide noise, and export a diagram that matches the mental
        model for an RFC or agent briefing.
      </p>

      <h2 className="mt-10 font-display text-2xl text-text">Extend and grant agent access</h2>
      <p className="mt-3 text-text-secondary leading-relaxed">
        TypeScript plugins live beside the data. Agents talk to a local MCP server over stdio with
        per-connection policy and a durable request log.
      </p>
      <h3 className="mt-6 font-display text-xl text-text">Bring your own code</h3>
      <p className="mt-2 text-text-secondary leading-relaxed">
        Cell renderers, enrichers, custom views, query hooks, toolbar actions, and themes drop into
        a local plugins directory without leaving the native client.
      </p>
      <h3 className="mt-6 font-display text-xl text-text">Controlled MCP access</h3>
      <p className="mt-2 text-text-secondary leading-relaxed">
        Hidden, read, or write per connection. Read mode combines a keyword filter with an engine
        READ ONLY transaction that rolls back. Credentials never leave the laptop.
      </p>
    </main>
  );
}
