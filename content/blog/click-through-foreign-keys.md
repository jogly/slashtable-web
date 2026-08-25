---
title: Click through foreign keys and keep ER diagrams scoped
description: Walk PostgreSQL and MySQL relationships from the grid, then open a schema graph from one table so the diagram matches the feature a product engineer is shipping.
publishedAt: 2026-08-25
updatedAt: 2026-08-25
published: true
tags:
  - foreign-keys
  - schema-graph
  - postgres
  - mysql
tldr: Open the table for the feature, click a foreign key to follow the row, and use reverse lookups when inbound references matter. Open the schema graph from that same table, pin the roots, limit depth, and hide noise so the ER diagram stays small enough for an RFC.
---

## Start from the table the feature already uses

Product work usually starts with one table: `orders`, `accounts`, `invoice_items`. Open that table in the explorer instead of generating a diagram of the whole catalog.

1. Connect to PostgreSQL or MySQL (Neon branches and Docker compose databases work the same way).
2. Select the table that owns the feature.
3. Scan columns for foreign keys before writing join SQL.

SQLite files open the same way when the project keeps a local file database. Linux users can follow these steps on the alpha Debian/Ubuntu build; macOS is the primary platform.

## Follow a foreign key from the grid

1. Click a foreign key value on the current row.
2. /table opens the related records. The path becomes a breadcrumb tree; every level stays clickable.
3. Stack filters on the related table if the feature only cares about a subset (status, team, created-at window).

This is the loop for "why is this order stuck": start on `orders`, click `customer_id`, then click from the customer into recent shipments or invoices.

### Reverse lookups and join tables

Inbound references show every row that points at the current record. Pure join tables collapse into a direct relationship so the trail stays a product graph instead of a pile of mapping tables.

Use reverse lookups when the question is "what else touches this customer" rather than "what does this order point at."

## Keep the trail on the keyboard

The breadcrumb tree is the history. Walk it with `⌘←` `⌘→` `⌘↑` `⌘↓` when the mouse is in the way. Favorites can pin a filter set to a table so the next pass starts from the same slice.

## Open a schema graph from that table

A full-database ER diagram is the wrong artifact for a feature RFC. Open the graph from the table's context menu so the first node is the table already on screen.

1. Right-click (or use the context menu) on the starting table.
2. Open the schema graph from there.
3. Confirm the first node is the table from the grid, not an alphabetical dump of every relation.

### Pin roots, limit depth, hide noise

- **Pin** the tables that define the feature (`orders`, `customers`, `payments`).
- **Set depth** so the graph stops before audit tables and leftover import schemas take over.
- **Hide** tables that are true but irrelevant (job queues, leftover `tmp_*`, a second billing schema).
- Search by name when the remaining graph is still wider than the mental model.

What remains should match the story in the RFC: the tables a reader needs to understand the change, with edges that explain the clicks already taken in the grid.

## Use the diagram in product work

Export or screenshot the scoped graph once the pins and depth look right. Pair it with the breadcrumb path from a real row (`order 7834` → `customer 4821` → latest `shipments`) so the RFC shows both shape and an example record.

Agents on the local MCP server can request a scoped schema graph from a starting table as well. Give them the same starting table used in the UI, and keep prod hidden if the diagram should come from a branch or local compose stack. Setup for that path lives in [local MCP access to Postgres, MySQL, and SQLite](/blog/local-mcp-access-to-postgres-mysql-sqlite/).
