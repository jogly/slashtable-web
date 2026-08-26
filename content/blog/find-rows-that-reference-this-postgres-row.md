---
title: How do I find all rows that reference this Postgres row
description: See every row that still points at a Postgres address before you retry the delete.
publishedAt: 2026-08-25
published: false
tldr: Postgres refused to delete an address because other rows still point at it. Open that address. The same row lists who is still attached. Write the UNION only when the answer has to be a script.
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

Postgres just refused a DELETE on 100 Main St. The error says the key is still referenced. Sometimes it names one child table. Sometimes it names nothing. Before you retry the delete, you need every row that still points here.

That is a different job from "write a query once I know the tables."

![The stuck address. People, a school, and tags still point at it.](/blog/find-rows-that-reference-this-postgres-row.jpg)

## The UNION needs a list you do not have

The answer that ranks is a UNION. Query every table that has a foreign key to this address, stack the hits, done. That is the right artifact for a script or for CI. It is the wrong first move when the child list is the unknown.

A [Stack Overflow thread](https://stackoverflow.com/questions/558283/how-do-i-find-all-references-from-other-tables-to-a-specific-row) is this exact stuckness. The asker has one address row and writes: that would mean I would have to know the address is connected to a school. What if I do not know that. It could be one of ten other tables. The accepted answer is still the UNION.

`pg_constraint` gets you the table list. Then you still write the queries. The hole is not that SQL cannot do this. The hole is you are standing on one row and you do not have the list.

## The parent row is the list

Open the address table in /table. 100 Main St is already there. Stay on that row.

Incoming references show up as columns on the row you are trying to delete: two people, one school, two tags. The people and the school are ordinary child tables. The tags come through a join that does not become its own stop.

Click the people list. The next grid is the two people who still live at 100 Main St. Click the school or the tags the same way. Each click is "show me those records," not "guess the next table and write its SELECT."

Two ways to land on this address look the same and are not. Clicking an address on a person row gets you here. That is how you arrived. It does not list who else still points at 100 Main St. Opening the address as the stuck parent does.

A depth-1 schema graph from this table is a neighbor picture. It is for the next click. It is not the incoming list.

## Write SQL when this has to run without a desktop

If the answer has to be a script, a CI check, or a ticket for someone who cannot open the app, stay in catalog SQL. The UNION is then the product. Build it after you have the table list, not as a way to discover the table list.

If Postgres already named one child table and that hop is the whole job, the other client's one-hop panel is enough.

Use the /table walk when the unknown is which tables still point here, and you want that list on the row you are about to delete.

| Job | Write SQL | One-hop panel | /table |
| --- | --- | --- | --- |
| Script, CI, or no desktop | Yes | No | No |
| One child table already named | Optional | Enough | More than needed |
| Child tables are unknown | After you find them | Another tab per table | Incoming lists on this row |
| Many-to-many through a join | Join SQL you write | Often the pivot as an extra hop | Tags stay on the address |
