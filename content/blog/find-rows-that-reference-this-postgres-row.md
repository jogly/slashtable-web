---
title: How do I find all rows that reference this Postgres row
description: The FK delete error names one child. The incoming set is larger.
publishedAt: 2026-08-25
published: false
tldr: The DETAIL line is a sample. Ask every child, including the far side of a join, before you retry the delete. Write the UNION when the answer has to be a script.
demand_query: how do I find all rows that reference this postgres row
cluster: fk-navigation
demand_urls:
  - https://stackoverflow.com/questions/558283/how-do-i-find-all-references-from-other-tables-to-a-specific-row
  - https://stackoverflow.com/questions/14357121/get-all-the-rows-referencing-via-foreign-keys-a-particular-row-in-a-table
  - https://dbeaver.com/docs/dbeaver/References-Panel/
  - https://www.jetbrains.com/help/datagrip/rows.html
session_log: session.md
image: /blog/find-rows-that-reference-this-postgres-row.jpg
imageAlt: Metal house numbers on a dark exterior wall
imageCredit: Photo by Haberdoedas on Unsplash
imageCreditUrl: https://unsplash.com/photos/three-address-numbers-on-a-dark-wall-3eLWbag4MOE
---

```text
ERROR: update or delete on table "master" violates foreign key constraint
DETAIL: Key (id)=(1) is still referenced from table "other".
```

The [Stack Overflow asker](https://stackoverflow.com/questions/14357121/get-all-the-rows-referencing-via-foreign-keys-a-particular-row-in-a-table) wanted every row that still pointed at the parent, without raising this error. The engine named one child and stopped. That DETAIL line is a sample. The incoming set is larger, and the engine did not list it.

People treat the named table as the inventory. They re-point or delete those rows, retry, and get the same error from a different table. The question is still open because the first answer the engine volunteers is the wrong size.

![The error named one child. Other tables can still point here.](/blog/find-rows-that-reference-this-postgres-row.jpg)

## The engine stops at the first row

`ON DELETE RESTRICT` and `NO ACTION` look for a referencing row, raise, and stop. The `DETAIL` line names that one table. Other tables can still point here. The pointer lives on the child, so the parent row you are staring at has no field that lists the rest.

The engine will not volunteer the set. It volunteered a blocker.

## Asking the catalog still leaves you short

`pg_constraint` and `information_schema` list every table that is allowed to point at this parent. That is which children exist. The delete asks which rows still do.

The [2009 Stack Overflow thread](https://stackoverflow.com/questions/558283/how-do-i-find-all-references-from-other-tables-to-a-specific-row) is still the same answer: query each child you already know, or generate a `UNION` from the catalog. That is the right script. It asks every child. It does not start from the named child and call it done.

A [References panel](https://dbeaver.com/docs/dbeaver/References-Panel/) or [Go To Related Rows](https://www.jetbrains.com/help/datagrip/rows.html) hops once. That is the sample again, with a nicer door. Enough when the error named the only child that matters. A nightly cleanup, a migration, or a CI check still wants the UNION.

## The join is in the set

The catalog will also show a join table as a first-class child. The rows that block the delete are on the far side. They belong in the incoming set, not as a second hop you take after you think you are done.

Treat the join as extra plumbing and those rows stay invisible until the next failed delete.

## Get the set before you retry

You are still looking at the parent. Open it in /table. The lists on that row are the incoming set, including the far side of the join. Click a list. The next grid is those rows. Then retry the delete.

Write the UNION when the answer has to be a script. Do not start from the named child and call it the inventory.
