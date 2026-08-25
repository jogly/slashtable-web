---
title: How do I find all rows that reference this Postgres address
description: Address id 1 (100 Main St) is already on screen, maybe after a failed DELETE. Open the address table in /table 0.5.16, refresh if you only see id and street, read tag (2), person (2), and school (1), then open a depth 1 schema graph from address.
publishedAt: 2026-08-25
updatedAt: 2026-08-25
published: true
tags:
  - foreign-keys
  - postgres
tldr: On /table 0.5.16, open the address table on address 1 (100 Main St). If the grid is only id and street, refresh the tab. Read `tag (2) →`, `person (2) →`, and `school (1) →`, click one incoming cell, then Open Schema Graph from address at depth 1. Catalog SQL still wins for a script, CI, or a role that cannot open the desktop client.
image: /blog/find-rows-that-reference-this-postgres-row.jpg
imageAlt: Three address numbers mounted on a dark wall.
imageCredit: Photo by Haberdoedas on Unsplash
imageCreditUrl: https://unsplash.com/photos/three-address-numbers-on-a-dark-wall-3eLWbag4MOE
---

## How do you find every row that still points at this Postgres address?

The person already has address id 1 (100 Main St), maybe after a failed DELETE. Open the address table in /table 0.5.16. If the grid is only id and street, refresh the tab. Address 1 then shows `tag (2) →`, `person (2) →`, and `school (1) →` in orange. Click one of those incoming cells. Then choose Open Schema Graph from address at depth 1 so the next hop is visible before the next click.

### What do you do once address 1 is on screen?

Open address, not person. The row on screen is id 1, street 100 Main St. After a refresh (if the first paint was only the physical columns), five columns are present: id (key), street (text), tag (chain), person (chain), school (chain). The orange cells on that row are the incoming foreign keys: `tag (2) →`, `person (2) →`, `school (1) →`.

Click `person (2) →` when the question is which people still point here. Two rows come back: Ada and Bea. Both still show address_id `1 →`. The filter bar holds a locked chip on address_id = 1. Click `school (1) →` or `tag (2) →` the same way.

address_tag stays italic with a chain icon, nested under address in Explorer. It is not a starting point and not a third grid hop. The many-to-many is the `tag` cell on address 1.

### Can you also arrive on this row through a child foreign key?

Yes. That hop is optional, and it is not the job. On person, address_id is a chain-icon link. Ada (id 1) and Bea (id 2) both show orange `1 →`. Clicking Ada's `1 →` drills to address. Breadcrumb chips read `person` then `address #1`. One row is on screen: id 1, 100 Main St, locked filter id = 1.

That is outbound navigation: a child foreign key to the parent row. TablePlus already ships the equivalent jump. The person who typed this query is already on the stuck address. Once address 1 is on screen, the work is the incoming cells, not another click on Ada.

### How do you see the next hop before another click?

From the address table context menu, choose Open Schema Graph. Depth defaults to 1. The tab pins address. The picture is address linked to person: person.address_id (chain icon) to address.id. The toolbar shows an address chip and depth 1. address_tag stays italic under address in Explorer. It does not become a third graph hop on this walk.

The grid already named who points here. The graph shows the neighbor before the next click. Depth 1 is enough for this job. Do not treat this as a full-database ER diagram.

## What do the incoming cells on address 1 actually show?

They are reverse foreign key columns on the same grid as the stuck row, not a side panel and not a UNION you write after guessing the children. On address 1 the columns are id, street, tag, person, and school. The last three are chain-icon relations. The cells read `tag (2) →`, `person (2) →`, and `school (1) →` in orange. Each count is how many rows still point at 100 Main St. A click opens that table with a locked filter. If a first open after an upgrade shows only id and street, refresh the tab so the reverse columns load.

### Is address_tag a third hop?

No. address_tag stays collapsed in Explorer: italic, chain icon, nested under address. The many-to-many is the `tag` column on the address row. The cell `tag (2) →` is two tag rows through that join. The walk does not open address_tag as its own grid hop.

That is the opposite of writing a join you already know. The far table is on the stuck row. The pivot stays in the tree as a collapsed relation.

### What does the locked filter on person mean?

Click `person (2) →` on address 1. Two rows come back: Ada and Bea. Both still show address_id `1 →`. The filter bar holds a locked chip on address_id = 1.

A NOT control is visible next to the equals sign. It is a UI toggle, not a SQL `<>` predicate. It is not engaged. The two visible rows are the people who point at address 1. Do not read that bar as `address_id <> 1`.

If this click followed the optional child hop through Ada, the breadcrumb chips read `person` then `address #1` then `person`. The locked chip is the fact that matters: these are the rows that still reference 100 Main St.

## When should you stay in catalog SQL or another client?

Stay in catalog SQL when the answer has to be a script, a CI check, or a ticket for someone who cannot open the desktop client. Stay in DBeaver References or DataGrip Go To Related Rows when Postgres already named the one child table and only that hop is needed. Use the /table walk when the unknown is which tables still point at this row, including a many-to-many that should not become a fake extra hop.

### What do the ranking pages actually teach?

Stack Overflow treats this as SQL you write after you already know the children. The asker on "How do I find all references from other tables to a specific row" writes: "if I have a specific row in the address table, is there a way to find out which row in which table points to it." Then: "that would mean I would have to know that the address in row 1 is connected to a school. But what if I don't know that? It could be 1 of 10 other tables..." The accepted answer is: "You're going to have to query each of the other tables. I would do it as a UNION query."

https://stackoverflow.com/questions/558283/how-do-i-find-all-references-from-other-tables-to-a-specific-row

That UNION is the right artifact for a script. It is the wrong first move when the child list is the unknown.

A second thread wants dependents before a DELETE. The accepted path is pgAdmin's dependents pane (objects, not rows) plus hand-written queries on the columns you identified.

https://stackoverflow.com/questions/12748752/postgresql-list-dependent-rows

A third thread quotes the engine (`Key (id)=(1) is still referenced from table "other"`) and asks how to get that information without raising the error. The answers go to `pg_constraint` and dynamic SQL.

https://stackoverflow.com/questions/14357121/get-all-the-rows-referencing-via-foreign-keys-a-particular-row-in-a-table

DBeaver's References panel is a one-hop side panel. The docs say: "The References panel shows related records from other tables connected by foreign keys." For inbound keys: "If another table references the current one, the panel shows all rows that refer to the selected primary key in the current table." Then: "Click Open on the panel toolbar to open the referenced table in a new tab."

https://dbeaver.com/docs/dbeaver/References-Panel/

That is one hop, in a side panel, then a new tab. It is not a breadcrumb of the stuck row, and it is not a graph pinned from that table.

DataGrip is a jump. The rows help page says you can "navigate between related rows of one or several tables" by primary or foreign keys. The action is: "Right-click a row or cell in a table and select Go To | Related Rows."

https://www.jetbrains.com/help/datagrip/rows.html

TablePlus still has an open 2018 request titled "Showing back-referencing ForeignKeys for the current table." The asker writes: "As far as I know, traversing back to where the foreign key is linked from, only Valentina Studio and JetBrain's DataGrip can do that." And: "Harder than that, but I want to see, is traversing Many-to-Many relationship... I don't know any app that support this one..."

https://github.com/TablePlus/TablePlus/issues/660

Outbound click (one FK on the column) already jumps to the parent in TablePlus. Incoming rows and many-to-many are the missing half.

### Which tool for which job?

| Job | Catalog SQL | DBeaver or DataGrip | /table 0.5.16 walk |
| --- | --- | --- | --- |
| Script, CI, or a role that cannot open the desktop client | Use this | No | No |
| Postgres already named one child table | Optional | References panel or Go To Related Rows | Works, more than needed |
| Child tables are unknown | UNION after you already know them, or pg_constraint first | One hop, then another tab | Relation cells on this row, then a graph from this table |
| Many-to-many through a join table | Join SQL you write | Often the pivot as an extra hop | `tag (2) →` on address; address_tag stays collapsed |

### When not to use the grid

Do not use the grid when the output has to run without a desktop. Catalog SQL still wins for a script, CI, or a role that cannot open the desktop client. The Stack Overflow `pg_constraint` answers are the right artifact there.

Do not use the walk to generate a full-database ER diagram. Open Schema Graph from address at depth 1 is a neighbor picture for the next click, not a catalog dump.

Do not start on person and call the outbound `1 →` the answer. That hop lands on address 1. It does not list who still points at 100 Main St.

## FAQ

### Does the References panel in DBeaver do this?

It lists inbound rows for the selected key, then Open puts that table in a new tab. It does not keep a breadcrumb of address 1, and it does not pin a depth 1 graph from that table.

### Does DataGrip Go To Related Rows do this?

It jumps to related rows from a selection. It is a go-to, not a trail, and not a scoped graph.

### Why not write the UNION?

Write it when the child tables are known and the output must be SQL. The original Stack Overflow question is the case where they are not known: "It could be 1 of 10 other tables..."

### Is address_tag a third click?

No. It stays collapsed in Explorer. The many-to-many is the `tag (2) →` cell on address 1.

### Can this walk run on Linux?

Linux is alpha. The recorded walk is on the 0.5.16 Linux build. Do not pick an architecture for someone else.

## Sources

- [How do I find all references from other tables to a specific row](https://stackoverflow.com/questions/558283/how-do-i-find-all-references-from-other-tables-to-a-specific-row)
- [PostgreSQL: list dependent rows](https://stackoverflow.com/questions/12748752/postgresql-list-dependent-rows)
- [Get all the rows referencing via foreign keys a particular row](https://stackoverflow.com/questions/14357121/get-all-the-rows-referencing-via-foreign-keys-a-particular-row-in-a-table)
- [DBeaver References panel](https://dbeaver.com/docs/dbeaver/References-Panel/)
- [DataGrip: rows, Go To Related Rows](https://www.jetbrains.com/help/datagrip/rows.html)
- [TablePlus issue 660, reverse foreign keys](https://github.com/TablePlus/TablePlus/issues/660)
- [Changelog](https://www.slashtable.dev/changelog/)
