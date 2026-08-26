---
title: How do I find all rows that reference this Postgres row
description: See every row that still points at a Postgres address before you retry the delete.
publishedAt: 2026-08-25
published: false
tldr: Postgres refused to delete 100 Main St because other rows still point at it. Open that address in /table. The grid lists every incoming row. Stay in catalog SQL when the answer has to be a script.
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

Postgres refused to delete 100 Main St. The error says the key is still referenced. Sometimes it names one child table. Sometimes it does not. The job is to see every row that still points here before trying the delete again.

![The delete is stuck on this address. Incoming people, a school, and tags still point at it.](/blog/find-rows-that-reference-this-postgres-row.jpg)

## The delete is stuck

A UNION only works after those tables are already known. That is the hole the ranking pages leave.

The [Stack Overflow thread](https://stackoverflow.com/questions/558283/how-do-i-find-all-references-from-other-tables-to-a-specific-row) that asks this is the same hole. The asker has a specific address row and writes: "that would mean I would have to know that the address in row 1 is connected to a school. But what if I don't know that? It could be 1 of 10 other tables..." The accepted answer is to query each other table as a UNION. That UNION is the right artifact for a script or CI. It is the wrong first move when the child list is the unknown.

A [second thread](https://stackoverflow.com/questions/12748752/postgresql-list-dependent-rows) wants dependents before a DELETE. The accepted path is pgAdmin's dependents pane (objects, not rows) plus hand-written queries on columns already identified. A [third](https://stackoverflow.com/questions/14357121/get-all-the-rows-referencing-via-foreign-keys-a-particular-row-in-a-table) quotes `Key (id)=(1) is still referenced from table "other"` and goes to `pg_constraint` and dynamic SQL.

Desktop clients hop one table at a time. [DBeaver's References panel](https://dbeaver.com/docs/dbeaver/References-Panel/) lists inbound rows, then Open sends that table to a new tab. [DataGrip](https://www.jetbrains.com/help/datagrip/rows.html) jumps from a selected cell: right-click, Go To, Related Rows. [TablePlus](https://github.com/TablePlus/TablePlus/issues/660) still has an open 2018 request for incoming rows and many-to-many. None of those pages start on the stuck address and keep the incoming people, school, and tags on that same row.

## Open the address

Open /table and open the address table. The stuck row is already there: id 1, street 100 Main St. After the grid has the relationship columns, that row also lists who points at it. In the recorded walk that is two people (Ada and Bea), one school, and two tags. The people and the school are ordinary child tables. The tags come through a join without opening that join as its own stop.

Click the people list on that address. The next grid is Ada and Bea, both still tied to 100 Main St, with a filter locked on that address. Click the school list or the tag list the same way. Each click is "show me those records," not "write the UNION for a table I already knew about."

You can also arrive on 100 Main St by clicking an address on a person row. That hop is how you got here. It does not answer who else still points at the address.

Right-click address in Explorer and choose Open Schema Graph. Depth 1 pins this table and shows a neighbor. In the recorded walk the neighbor is person, linked on the address key. That picture is for the next click. It is not a full-database ER diagram.

If the address grid only shows street and id after an upgrade, refresh the tab so the incoming lists load. Linux is alpha. The recorded walk is on Linux. Do not pick an architecture for someone else.

## When to stay in SQL

Stay in catalog SQL when the answer has to run without a desktop: a script, CI, or a ticket for someone who cannot open the app. Stay in DBeaver or DataGrip when Postgres already named the one child table and only that hop is needed. Use the /table walk when the unknown is which tables still point here, including a many-to-many that should not become a fake extra stop.

| Job | Catalog SQL | DBeaver or DataGrip | /table |
| --- | --- | --- | --- |
| Script, CI, or no desktop | Use this | No | No |
| Postgres already named one child table | Optional | References panel or Go To Related Rows | Works, more than needed |
| Child tables are unknown | UNION after you know them, or pg_constraint first | One hop, then another tab | Incoming lists on this row, then a graph from this table |
| Many-to-many through a join | Join SQL you write | Often the pivot as an extra hop | Tags on the address; the join stays collapsed |

Do not use the grid when the output has to run without a desktop. The Stack Overflow `pg_constraint` answers are the right artifact there. Do not open a schema graph of the whole database and call that the answer. Depth 1 from the stuck table is a neighbor picture. Do not start on a person row and treat the click to the parent address as the answer. That lands on 100 Main St. It does not list who still points at it.
