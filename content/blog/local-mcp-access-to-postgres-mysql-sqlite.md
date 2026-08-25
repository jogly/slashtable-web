---
title: Local MCP access to Postgres, MySQL, and SQLite
description: Enable the /table desktop MCP server so Claude Desktop, Claude Code, Cursor, or Windsurf can reach Postgres, MySQL, SQLite, or Neon over local stdio. Credentials stay on the machine.
publishedAt: 2026-08-25
updatedAt: 2026-08-25
published: true
tags:
  - mcp
  - postgres
  - mysql
  - sqlite
tldr: Install /table, add a connection, enable the MCP server in Settings, then point Claude Desktop, Claude Code, Cursor, or Windsurf at that local stdio server. Pick hidden, read, or write per connection. Credentials never leave the machine. This website is not a query endpoint.
image: /blog/local-mcp-access-to-postgres-mysql-sqlite.jpg
imageAlt: Server racks with glowing orange and cyan network cables.
imageCredit: Photo by Taylor Vick on Unsplash
imageCreditUrl: https://unsplash.com/photos/M5tzZtFCOfs
---

## Install the desktop app

/table is a local database client. The MCP server ships inside that installed app and speaks stdio to the agent client on the same machine.

1. Download a macOS build from [the download page](/download/), or install with Homebrew after `brew tap slashtable/cask` then `brew install --cask slashtable`.
2. Linux is alpha. Debian/Ubuntu `.deb` builds are on the same download page, or run `curl -fsSL https://slashtable.dev/install.sh | sh` when the machine arch is known (`amd64` or `aarch64`).
3. Open the app. The Mac bundle filename is SlashTable.app; the product name in the UI is /table.

## Add a Postgres, MySQL, SQLite, or Neon connection

Agents only see connections that already exist in the app.

1. Create a connection for the engine in use: PostgreSQL, MySQL, SQLite, or Neon.
2. Use a local Docker database, a Neon branch, an SSH-tunneled host, or a SQLite file, the same way a human would work in the client.
3. Leave credentials on the machine. macOS Keychain and 1Password are the usual stores; Bitwarden, AWS Secrets Manager, and HashiCorp Vault are in alpha.

Queries run in the installed app against that connection. This website is not a query endpoint.

## Enable MCP in Settings

1. Open Settings in the running app.
2. Enable the MCP server.
3. Keep the app running while an agent is connected. The server is the local stdio process inside that app.

Discovery documents on the website (`/.well-known/mcp.json` and the [server card](https://www.slashtable.dev/.well-known/mcp/server-card.json)) describe that local stdio transport. Use them to confirm transport and setup, then configure the agent client against the installed app.

## Connect Claude Desktop, Claude Code, Cursor, or Windsurf

Point the agent client at the local stdio server that /table started. Setup is two clicks in the app after the connection exists.

Typical order:

1. Confirm /table is open and MCP is enabled.
2. Confirm the target connection is listed in the app.
3. In the agent client, add the /table MCP server over stdio (Claude Desktop, Claude Code, Cursor, or Windsurf).
4. Ask the agent to describe tables, keys, and relationships on that connection before writing SQL.

Skip inventing a remote MCP hostname, port, or cloud endpoint. The transport is stdio on the same machine.

## Set hidden, read, or write per connection

Policy is per connection, so a laptop can hold prod, staging, and a local compose stack without handing every one to the agent.

- **Hidden:** the connection is invisible to the agent.
- **Read:** a statement-level keyword filter plus an engine-level `READ ONLY` transaction that rolls back, including CTE writes that slip past the keyword list.
- **Write:** the agent can mutate data on that connection. Treat this as an explicit choice for a disposable local database.

A useful default for product work: hide prod, allow read on staging or a Neon branch, and allow write only on a local Docker or SQLite file.

## Review every call in the MCP Log

Open the MCP Log tab after the first agent turn. Each row records method, tool, connection, and duration. If the agent reached the wrong database, change that connection to hidden and retry.

## When this website is involved

Use [llms.txt](/llms.txt), the [developers portal](/developers/), and this blog to learn setup. This website is not a query endpoint. Queries run in the installed app, through the local stdio MCP server, against credentials that stayed on the machine.
