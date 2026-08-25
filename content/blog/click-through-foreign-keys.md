---
title: Click through foreign keys and keep ER diagrams scoped
description: Walk PostgreSQL and MySQL relationships from the grid, then open a schema graph from one table so the diagram matches the feature a product engineer is shipping.
publishedAt: 2026-08-25
updatedAt: 2026-08-25
published: false
tags:
  - foreign-keys
  - schema-graph
  - postgres
  - mysql
tldr: Open the table for the feature, click a foreign key to follow the row, and use reverse lookups when inbound references matter. Open the schema graph from that same table (context menu, or ⌘Shift+G then add a root). Set depth so the diagram stays small enough for an RFC. Agents on the local MCP server can request the same scoped graph with get_schema_graph.
image: /blog/click-through-foreign-keys.jpg
imageAlt: Tree roots branching from one trunk across moss and soil.
imageCredit: Photo on Unsplash
imageCreditUrl: https://unsplash.com/photos/HeAxrQdaxLQ
---

## Why start from one table instead of the whole catalog?

Product work usually starts with one table: `orders`, `accounts`, `invoice_items`. A full-database ER diagram is the wrong artifact for that. The useful graph is the neighborhood of the table already on screen.

This walk uses a familiar shape: `orders` → `customers`, plus `order_items` sitting on the order. PostgreSQL and MySQL behave the same way in the explorer. Neon branches and Docker compose databases open like any other connection. SQLite files work when the project keeps a local file database.

Linux users can follow these steps on the alpha Debian/Ubuntu build. macOS is the primary platform.

## How do you follow a foreign key from the grid?

1. Connect and open the table that owns the feature. Start on `orders`, not on an alphabetical dump of every relation.
2. Scan columns for foreign keys before writing join SQL.
3. Click a foreign key value on the current row. /table opens the related records. The path becomes a breadcrumb tree. Every level stays clickable.
4. Stack filters on the related table if the feature only cares about a subset (status, team, created-at window).

This is the loop for "why is this order stuck": start on `orders`, click `customer_id`, then click from the customer into recent shipments or invoices.

### What do reverse lookups and join tables do?

Inbound references show every row that points at the current record. Pure join tables collapse into a direct relationship, so the trail stays a product graph instead of a pile of mapping tables.

Use reverse lookups when the question is "what else touches this customer" rather than "what does this order point at."

### Can you keep the trail on the keyboard?

The breadcrumb tree is the history. Walk it with `⌘←` `⌘→` `⌘↑` `⌘↓` when the mouse is in the way.

Collapsed branches in that tree show the active node inline, with sibling count pills (shipped in v0.2.7).

## How do you open a schema graph from that same table?

The first node should be the table already on screen.

**From the connection explorer**

1. Right-click the starting table.
2. Choose Open Schema Graph.
3. Confirm the first node is that table, not every relation in the catalog.

**From a new tab**

1. Press `⌘Shift+G`, or open a new tab and choose Schema Graph.
2. Press `⌘S` or click Add root table.
3. Type `orders` (or the feature table) and press Enter.
4. Related tables (`customers`, `order_items`) appear as connected nodes.

Nodes show the table name and columns. Edges are foreign keys, including self-referencing ones.

### How do you keep the diagram small enough for an RFC?

1. Find the depth control in the toolbar (default is 1 or 2). Increase it only when the next hop is part of the feature. Decrease it when audit tables and leftover import schemas take over.
2. Toggle column visibility on a node when the column list is noise.
3. Drag a node if the automatic placement hides an edge you care about, then click Auto-layout when the canvas needs to be tidy again.
4. Add a second root table only when the RFC actually spans two clusters.

What remains should match the story in the RFC: the tables a reader needs to understand the change, with edges that explain the clicks already taken in the grid.

Search by name in the add-root overlay when the remaining graph is still wider than the mental model.

## How does an agent walk the same path?

Agents on the local MCP server can request the same scoped neighborhood. Enable that server in Settings in the current app, then give the agent the starting table used in the UI. Keep production Hidden if the diagram should come from a branch or local compose stack. A longer setup draft is [Local MCP access to Postgres, MySQL, and SQLite](/blog/local-mcp-access-to-postgres-mysql-sqlite).

`describe_table` returns columns, foreign keys, and relationship names. `get_related_records` follows one of those names from a real primary key:

- `connection_id`: the saved connection
- `table`: `orders`
- `pk_value`: the order you clicked in the grid
- `relationship`: a name `describe_table` already showed, for example `orders → customers`, or a many-to-many form like `users ↔ roles (via user_roles)`

`get_schema_graph` is the diagram call:

- `tables`: `["orders"]`
- `depth`: `1` for direct neighbors, `2` or `3` only when the RFC needs the next hop
- Join and bridge tables are traversed and do not count as a hop
- The result includes `boundary_tables`: tables at the edge with unexplored neighbors. Call the tool again with those as roots instead of dumping the catalog.

`get_schema_graph` has taken starting tables plus depth since v0.2.7. It used to dump the full schema.

A useful pairing: click `order 7834` → `customer 4821` in the grid, screenshot the scoped graph from `orders` at depth 1, and let the agent confirm the same neighborhood with `get_schema_graph` before it writes a join.

## How do you put the graph in an RFC?

Screenshot the scoped graph once the roots and depth look right. Pair it with the breadcrumb path from a real row (`order 7834` → `customer 4821` → latest `shipments`) so the RFC shows both shape and an example record.

Do not paste a whole-catalog export. The point of starting from one table is that the reader can hold the change.

## FAQ

### Should the schema graph open on the whole database?

No. Add the feature table as a root. Raise depth only when a missing neighbor is part of the change.

### What about many-to-many join tables?

In the explorer, pure join tables collapse into a direct relationship. In `get_schema_graph`, join tables are traversed and do not count as a hop. The relationship name from `describe_table` can look like `users ↔ roles (via user_roles)`.

### Does this work on SQLite?

Yes, when the project keeps a local file database. The same click path and schema graph apply. Foreign-key coverage still depends on the file actually declaring those constraints.

### Can an agent replace the grid clicks?

The agent can follow the same named relationships and request the same scoped graph. The grid is still the fastest way to see a stuck row. Use both: click once so the example is real, then let the agent reuse that starting table.

### Where does MCP setup live?

Setup lives in Settings in the current app. A longer draft is [Local MCP access to Postgres, MySQL, and SQLite](/blog/local-mcp-access-to-postgres-mysql-sqlite); that slug stays unpublished until setup is rewritten against v0.6.0. This website is not a query endpoint.

## Sources

- Connection explorer context menu: Open Schema Graph
- Schema graph tab: `⌘Shift+G`, Add root table (`⌘S`), depth control, column visibility, Auto-layout
- [Changelog](/changelog) (v0.2.7: `get_schema_graph` from starting tables plus depth; breadcrumb collapsed branches)
- [Local MCP access to Postgres, MySQL, and SQLite](/blog/local-mcp-access-to-postgres-mysql-sqlite)
