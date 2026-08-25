---
title: How do I find all rows that reference this Postgres row
description: See every row that still points at a Postgres address before you retry the delete.
publishedAt: 2026-08-25
published: false
tldr: Postgres refused to delete 100 Main St because other rows still point at it. The ranking answers assume you already know which tables those are. Open that address in /table. The grid lists every incoming row (two people, one school, two tags). Click one list to see the records. Stay in catalog SQL when the answer has to be a script.
demand_query: how do I find all rows that reference this postgres row
cluster: fk-navigation
demand_urls:
  - https://stackoverflow.com/questions/558283/how-do-i-find-all-references-from-other-tables-to-a-specific-row
  - https://dbeaver.com/docs/dbeaver/References-Panel/
  - https://www.jetbrains.com/help/datagrip/rows.html
  - https://github.com/TablePlus/TablePlus/issues/660
session_log: session.md
image: /blog/find-rows-that-reference-this-postgres-row.jpg
imageAlt: Metal house numbers on a dark exterior wall
imageCredit: Photo by Haberdoedas on Unsplash
imageCreditUrl: https://unsplash.com/photos/three-address-numbers-on-a-dark-wall-3eLWbag4MOE
---

## Why is this delete stuck?

Postgres just refused to delete an address. The row is 100 Main St. The error says the key is still referenced. Sometimes it names one child table. Sometimes it does not. The job is to see every row that still points here before trying the delete again. A UNION only works after those tables are already known. That is the hole the ranking pages leave.

### What does Stack Overflow actually tell you to do?

The asker on "How do I find all references from other tables to a specific row" has the same address. They write: "if I have a specific row in the address table, is there a way to find out which row in which table points to it." Then the part that matters: "that would mean I would have to know that the address in row 1 is connected to a school. But what if I don't know that? It could be 1 of 10 other tables..."

https://stackoverflow.com/questions/558283/how-do-i-find-all-references-from-other-tables-to-a-specific-row

The accepted answer is: "You're going to have to query each of the other tables. I would do it as a UNION query."

That UNION is the right artifact for a script or CI. It is the wrong first move when the child list is the unknown.

A second thread wants dependents before a DELETE. The accepted path is pgAdmin's dependents pane (objects, not rows) plus hand-written queries on columns you already identified.

https://stackoverflow.com/questions/12748752/postgresql-list-dependent-rows

A third thread quotes the engine (`Key (id)=(1) is still referenced from table "other"`) and asks how to get that information without raising the error. The answers go to `pg_constraint` and dynamic SQL.

https://stackoverflow.com/questions/14357121/get-all-the-rows-referencing-via-foreign-keys-a-particular-row-in-a-table

### What do the desktop clients do instead?

DBeaver puts inbound rows in a References side panel, then Open sends that table to a new tab.

https://dbeaver.com/docs/dbeaver/References-Panel/

DataGrip jumps from a selected cell: right-click, Go To, Related Rows.

https://www.jetbrains.com/help/datagrip/rows.html

TablePlus still has an open 2018 request for back-referencing foreign keys. The asker wants incoming rows and many-to-many. Outbound click to the parent already ships.

https://github.com/TablePlus/TablePlus/issues/660

None of those pages start on the stuck address and keep the incoming people, school, and tags on that same row.

## How do you see what still points at 100 Main St?

Open /table and open the address table. The stuck row is already there: id 1, street 100 Main St. After the grid has the relationship columns, that row also lists who points at it. In the recorded walk that is two people (Ada and Bea), one school, and two tags. The people and the school are ordinary child tables. The tags come through a join without opening that join as its own stop.

### What do you click when you want the actual rows?

Click the people list on that address. The next grid is Ada and Bea, both still tied to 100 Main St, with a filter locked on that address. Click the school list or the tag list the same way. Each click is "show me those records," not "write the UNION for a table I already knew about."

You can also arrive on 100 Main St by clicking an address on a person row. That hop is how you got here. It does not answer who else still points at the address.

### How do you see the next table before another click?

Right-click address in Explorer and choose Open Schema Graph. Depth 1 pins this table and shows a neighbor. In the recorded walk the neighbor is person, linked on the address key. That picture is for the next click. It is not a full-database ER diagram.

If the address grid only shows street and id after an upgrade, refresh the tab so the incoming lists load.

## When should you stay in SQL or another client?

Stay in catalog SQL when the answer has to run without a desktop: a script, CI, or a ticket for someone who cannot open the app. Stay in DBeaver or DataGrip when Postgres already named the one child table and only that hop is needed. Use the /table walk when the unknown is which tables still point here, including a many-to-many that should not become a fake extra stop.

### Which tool for which job?

| Job | Catalog SQL | DBeaver or DataGrip | /table |
| --- | --- | --- | --- |
| Script, CI, or no desktop | Use this | No | No |
| Postgres already named one child table | Optional | References panel or Go To Related Rows | Works, more than needed |
| Child tables are unknown | UNION after you know them, or pg_constraint first | One hop, then another tab | Incoming lists on this row, then a graph from this table |
| Many-to-many through a join | Join SQL you write | Often the pivot as an extra hop | Tags on the address; the join stays collapsed |

### When not to use the grid

Do not use the grid when the output has to run without a desktop. The Stack Overflow `pg_constraint` answers are the right artifact there.

Do not open a schema graph of the whole database and call that the answer. Depth 1 from the stuck table is a neighbor picture.

Do not start on a person row and treat the click to the parent address as the answer. That lands on 100 Main St. It does not list who still points at it.

## FAQ

### Does the References panel in DBeaver do this?

It lists inbound rows for the selected key, then Open puts that table in a new tab. It does not keep 100 Main St on screen as the place the lists live, and it does not pin a depth 1 graph from that table.

### Does DataGrip Go To Related Rows do this?

It jumps to related rows from a selection. It is a go-to, not a trail from the stuck address.

### Why not write the UNION?

Write it when the child tables are known and the output must be SQL. The original Stack Overflow question is the case where they are not known: "It could be 1 of 10 other tables..."

### Do you have to open the join table?

No. On this walk the join stays collapsed under address. The two tags show on the address row.

### Can this walk run on Linux?

Linux is alpha. The recorded walk is on Linux. Do not pick an architecture for someone else.

## Sources

- [How do I find all references from other tables to a specific row](https://stackoverflow.com/questions/558283/how-do-i-find-all-references-from-other-tables-to-a-specific-row)
- [PostgreSQL: list dependent rows](https://stackoverflow.com/questions/12748752/postgresql-list-dependent-rows)
- [Get all the rows referencing via foreign keys a particular row](https://stackoverflow.com/questions/14357121/get-all-the-rows-referencing-via-foreign-keys-a-particular-row-in-a-table)
- [DBeaver References panel](https://dbeaver.com/docs/dbeaver/References-Panel/)
- [DataGrip: rows, Go To Related Rows](https://www.jetbrains.com/help/datagrip/rows.html)
- [TablePlus issue 660, reverse foreign keys](https://github.com/TablePlus/TablePlus/issues/660)
- [Changelog](https://www.slashtable.dev/changelog/)
