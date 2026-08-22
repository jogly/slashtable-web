import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Workers outline probe</title>
  <meta name="robots" content="noindex,follow" />
  <link rel="canonical" href="https://slashtable-web.make-toast.workers.dev/workers-outline" />
</head>
<body>
  <main>
    <h1>Workers outline probe for agent extractors</h1>
    <p>
      This never-seen document is server-rendered HTML with a nested heading outline and more than
      five hundred characters of plain text. It exists so content extractors can score heading
      structure without JavaScript, without site chrome, and without organization JSON-LD that
      points at the marketing homepage.
    </p>
    <h2>Connect and explore data</h2>
    <p>
      Product engineers keep many environments open at once. Containers, branches, tunnels, and
      local files should appear as ordinary connections without ceremony or a hosted query API.
    </p>
    <h3>Docker and branch sync</h3>
    <p>
      Auto-detect running database containers and sync hosted branches so the sidebar matches the
      workspace already open on the machine.
    </p>
    <h3>SSH tunnels and vaults</h3>
    <p>
      Production behind a bastion and credentials in Keychain or 1Password stay local. Nothing is
      posted to a remote database endpoint for agents to call.
    </p>
    <h2>Navigate schema relationships</h2>
    <p>
      Click through foreign keys and reverse lookups with breadcrumbs instead of hand-written join
      SQL. Scoped graphs stay readable when depth and roots stay under control.
    </p>
    <h3>Bidirectional FK trails</h3>
    <p>
      Drill into related rows and climb back through the trail. Join tables collapse so navigation
      stays clean for humans and agents alike.
    </p>
    <h3>Scoped ER diagrams</h3>
    <p>
      Start from one table, pin roots, hide noise, and export a diagram that matches the mental
      model used in an RFC or agent briefing.
    </p>
    <h2>Extend and grant agent access</h2>
    <p>
      TypeScript plugins live beside the data. Agents talk to a local MCP server over stdio with
      per-connection policy and a durable request log on the laptop.
    </p>
    <h3>Bring your own code</h3>
    <p>
      Cell renderers, enrichers, custom views, query hooks, toolbar actions, and themes drop into a
      local plugins directory without leaving the native client.
    </p>
    <h3>Controlled MCP access</h3>
    <p>
      Hidden, read, or write per connection. Read mode combines a keyword filter with an engine
      READ ONLY transaction that rolls back. Credentials never leave the laptop.
    </p>
  </main>
</body>
</html>
`;

export function GET(_request: NextRequest) {
  return new Response(HTML, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      Vary: "Accept",
    },
  });
}
