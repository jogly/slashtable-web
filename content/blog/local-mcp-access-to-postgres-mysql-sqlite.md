---
title: Local MCP access to Postgres, MySQL, and SQLite
description: Enable the /table desktop MCP server so Claude Desktop, Claude Code, Cursor, or Windsurf can reach Postgres, MySQL, SQLite, or Neon over local HTTP. Credentials stay in the app.
publishedAt: 2026-08-25
updatedAt: 2026-08-25
published: true
tags:
  - mcp
  - postgres
  - mysql
  - sqlite
tldr: Install /table, add a connection, then enable the MCP server in Settings. Settings copies an HTTP snippet for Claude Desktop, Claude Code, Cursor, or Windsurf. The default URL is http://127.0.0.1:27420/mcp. Set Hidden, Read, or Write per connection. Credentials stay in the app. This website is not a query endpoint.
image: /blog/local-mcp-access-to-postgres-mysql-sqlite.jpg
imageAlt: A closed laptop on a wooden desk under a lamp in a dark room.
imageCredit: Photo on Unsplash
imageCreditUrl: https://unsplash.com/photos/bZD2E08iKCc
---

## Why do most Claude Desktop Postgres MCP posts put a connection string in the client config?

Search for local Postgres MCP and the usual answer is a one-database stdio server. The official `@modelcontextprotocol/server-postgres` package is the template. Claude Desktop starts `npx` and passes a URI as an argument.

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://localhost/mydb"
      ]
    }
  }
}
```

Source: [Usage with Claude Desktop](https://www.npmjs.com/package/@modelcontextprotocol/server-postgres) on the `@modelcontextprotocol/server-postgres` npm page.

That works for one Postgres database. It also puts the URI in the agent client's JSON. A password that belongs in a URI then lives in Claude's config file. Each extra database is another server block. MySQL and SQLite are different packages. There is no per-connection Hidden / Read / Write switch, and no foreign-key tools beyond "run SQL and hope the model writes the join."

/table is a different shape. The desktop client already owns connections, vaults, and policy. The MCP server lives inside that running app. The agent client gets a localhost URL. It does not get a connection string.

## What does /table start when MCP is enabled?

Settings → Enable MCP server starts a local HTTP server bound to `127.0.0.1`. The default port is `27420`. The JSON-RPC route is `POST /mcp`.

The hint on that toggle is: "Exposes your schema and data to AI agents via a local HTTP server. Access is configured per connection."

When the server is up, Settings shows an Endpoint row you can copy:

`http://127.0.0.1:27420/mcp`

Keep the app running while an agent is connected. Closing /table stops the local server.

The [discovery document](https://www.slashtable.dev/.well-known/mcp.json) on this website is right about the important part: there is no remote MCP URL, and queries do not run here. Settings is the source for the transport you actually paste. Those snippets are HTTP on localhost, not a `command` / `args` stdio block.

## How do you install /table?

1. macOS: download from [the download page](/download), or `brew tap slashtable/cask` then `brew install --cask slashtable`.
2. Linux is alpha. Debian/Ubuntu `.deb` builds are on the same page (`amd64` and `aarch64`). `curl -fsSL https://slashtable.dev/install.sh | sh` also works when the machine architecture is known. Do not pick an arch because a page guessed.
3. Open the app. The Mac bundle filename is SlashTable.app. The product name in the UI is /table.

## How do you add a connection an agent can see?

Agents only see connections that already exist in the app.

1. Create a connection for PostgreSQL, MySQL, SQLite, or Neon.
2. Use a local Docker database (the app can detect compose Postgres/MySQL), a Neon branch, an SSH-tunneled host, or a SQLite file.
3. Leave credentials on the machine. macOS Keychain and 1Password are the usual stores. Bitwarden, AWS Secrets Manager, and HashiCorp Vault are in alpha.

The agent never receives that URI. `list_connections` returns saved connection IDs and whether each is connected. `connect` takes one of those IDs.

This website is not a query endpoint. Queries run in the installed app against that connection.

## How do you enable the MCP server?

1. Open Settings.
2. Turn on Enable MCP server.
3. Confirm the Endpoint row shows `http://127.0.0.1:27420/mcp` (or the port Settings actually bound).
4. Leave the app running.

If the server fails to bind, Settings shows an error callout on that same row. Fix the port conflict in the app, then copy the Endpoint again. Do not invent a hostname.

## What do you paste into Claude Desktop, Claude Code, Cursor, or Windsurf?

Settings has a tab per client and copies the snippet for the current port. These are the four it ships, copied from Settings → Enable MCP server.

### Claude Desktop and Cursor

```json
{
  "mcpServers": {
    "slashtable": {
      "type": "http",
      "url": "http://127.0.0.1:27420/mcp"
    }
  }
}
```

Source: Settings → Enable MCP server, Claude Desktop tab and Cursor tab.

### Claude Code

```bash
claude mcp add slashtable --transport http http://127.0.0.1:27420/mcp
```

Source: Settings → Enable MCP server, Claude Code tab.

### Windsurf

```json
{
  "mcpServers": {
    "slashtable": {
      "serverUrl": "http://127.0.0.1:27420/mcp"
    }
  }
}
```

Source: Settings → Enable MCP server, Windsurf tab.

If Settings bound a different port, copy the Endpoint from the app and substitute it. Do not change `type` to `stdio` or add a `command` field. The agent talks HTTP to localhost.

Typical order after the snippet is saved:

1. Confirm /table is open and MCP is enabled.
2. Confirm the target connection exists and is not Hidden.
3. Restart or reload the agent client so it picks up the new server.
4. Ask the agent to list connections, then describe tables, keys, and relationships before writing SQL.

## What does Hidden, Read, and Write actually allow?

Policy is per connection. A laptop can hold prod, staging, and a local compose stack without handing every one to the agent.

The three labels and hints are the ones the connection picker shows:

- **Hidden:** "This connection won't appear to AI agents."
- **Read:** "AI agents can browse schema and read data." `execute_query` allows `SELECT`, `WITH`, and `EXPLAIN` only. Postgres and MySQL wrap that in `SET TRANSACTION READ ONLY`. SQLite flips `PRAGMA query_only`. The transaction rolls back, including CTE writes that slip past a keyword list.
- **Write:** "AI agents can run any SQL: INSERT, UPDATE, DELETE, DROP." That includes DDL.

A useful default for product work: hide prod, allow Read on staging or a Neon branch, and allow Write only on a local Docker or SQLite file.

`list_connections` includes an `mcpAccess` field. Check it before asking an agent to mutate anything.

## Which tools does the server expose?

These are the tools the local server registers.

- `list_connections`: list saved connections and whether each is connected.
- `connect`: connect by saved `connection_id`.
- `list_schemas`: list non-system schemas. Call this before `list_tables` when the table might not live in `public`.
- `list_tables`: tables in one schema (default `public`).
- `describe_table`: columns, constraints, foreign keys, indexes, and relationships. Required arguments: `connection_id`, `table`.
- `get_records`: rows with optional `schema`, `limit` (default 100), and `offset` (default 0).
- `get_record`: one row by `pk_column` and `pk_value`.
- `get_related_records`: rows related through a named FK relationship, for example `orders → customers`. Required: `connection_id`, `table`, `pk_value`, `relationship`.
- `get_schema_graph`: subgraph from starting `tables` plus `depth` (default 1). Join tables do not count as a hop. The result includes `boundary_tables` for the next call.
- `execute_query`: SQL on a `connection_id`. Read connections: `SELECT` / `WITH` / `EXPLAIN` only. Write connections: any SQL, including `INSERT`, `UPDATE`, `DELETE`, and DDL.

A first honest session looks like this:

1. `list_connections`
2. `connect` with the ID for the local or branch database
3. `list_schemas`, then `list_tables` on the schema that actually holds the feature
4. `describe_table` on the starting table
5. `get_schema_graph` with that table and `depth` 1 or 2
6. `execute_query` only after the graph matches the feature

Walking foreign keys in the UI, then asking an agent for the same scoped graph, is [Click through foreign keys and keep ER diagrams scoped](/blog/click-through-foreign-keys).

## How do you check the first session?

Open the MCP Log after the first agent turn. Each row records method, tool, connection, and duration. If the agent reached the wrong database, set that connection to Hidden and retry.

## Does slashtable.dev run the query?

No. Use [llms.txt](/llms.txt), the [developers portal](/developers), and this blog to learn setup. The [discovery document](https://www.slashtable.dev/.well-known/mcp.json) and [server card](https://www.slashtable.dev/.well-known/mcp/server-card.json) describe a local server inside the installed app. This website is not a query endpoint.

## FAQ

### Do I need one MCP server per database?

No. One /table MCP server fronts every saved connection. Policy is the Hidden / Read / Write control on each connection, not a second `npx` process.

### Why does the website discovery document mention stdio?

That document means there is no hosted MCP URL to POST at. Settings is the source for what to paste: HTTP on `127.0.0.1`.

### What if port 27420 is already taken?

Copy the Endpoint Settings actually shows after the server starts. Substitute that URL in the snippet. Do not guess a public hostname.

### Does the app have to stay open?

Yes. The HTTP server is inside the running desktop app.

### Does this work on Linux?

Linux is alpha. The same Settings snippets apply on the Debian/Ubuntu build once the app is running. Do not pick `amd64` or `aarch64` unless the machine architecture is known.

### Can Write stay on for production?

The Write hint is explicit: any SQL, including `DROP`. Hide production. Use Write on a disposable local database.

## Sources

- Settings → Enable MCP server (Claude Desktop, Claude Code, Cursor, and Windsurf snippets; Endpoint `http://127.0.0.1:27420/mcp`)
- [@modelcontextprotocol/server-postgres on npm](https://www.npmjs.com/package/@modelcontextprotocol/server-postgres)
- [/.well-known/mcp.json](https://www.slashtable.dev/.well-known/mcp.json)
- [Changelog](/changelog) (MCP Settings tab and copyable configs shipped in v0.2.7; `get_schema_graph` scoped from starting tables plus depth)
- [Download](/download)
