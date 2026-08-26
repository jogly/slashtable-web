---
title: How do I find all rows that reference this Postgres row
description: Postgres stores the pointer on the child. See every row that still points at a parent before you retry the delete.
publishedAt: 2026-08-25
published: false
tldr: The parent is mute. A foreign key lives on the child. The catalog names tables. The delete needs the incoming rows on that parent, including through a join. Write the UNION when the answer has to be a script.
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

Postgres will not delete a row that other rows still point at. The error names one constraint and one child table. The parent looks the same as it did before the delete. A foreign key is a column on the child, plus a constraint that says the value must exist on the parent. Both live on the referencing table. Select the parent and you get the parent. The incoming set is stored somewhere else. The parent is mute.

![The pointer lives on the child.](/blog/find-rows-that-reference-this-postgres-row.jpg)

## The pointer lives on the child

When a person, a school, or an order stores an `address_id`, the pointer is written on that child. Postgres records the constraint the same way. In `pg_constraint`, `conrelid` is the table that has the column. `confrelid` is the table being pointed at. Nothing is written onto the parent row.

That is why a delete of the parent can fail after you have been staring at it. The blocking rows are in other tables, and this row has no field that says which.

`ON DELETE RESTRICT` and `NO ACTION` are the usual case. Postgres finds one referencing row, raises the error, and stops. The `DETAIL` line names that one table. Other tables can still point here. The error is a sample.

```
ERROR: update or delete on table "master" violates foreign key constraint
DETAIL: Key (id)=(1) is still referenced from table "other".
```

Source: https://stackoverflow.com/questions/14357121/get-all-the-rows-referencing-via-foreign-keys-a-particular-row-in-a-table

The asker on that thread wanted the incoming set without raising the error. The engine will not volunteer it. The parent cannot.

## The catalog answers a different question

`pg_constraint` and `information_schema` will list every table that is allowed to point at this one. That is the question the catalog can answer: which children exist. The delete asks which rows still do.

The [2009 Stack Overflow thread](https://stackoverflow.com/questions/558283/how-do-i-find-all-references-from-other-tables-to-a-specific-row) for this job is still the same answer: query each child you already know, or generate a `UNION` from the catalog. That is asking every child, out loud. It is the right script. It leaves the incoming set off the parent you are looking at.

A [References panel](https://dbeaver.com/docs/dbeaver/References-Panel/) or [Go To Related Rows](https://www.jetbrains.com/help/datagrip/rows.html) hops once. That is asking one child. Enough when the error already named that child and that hop is the whole job. A nightly cleanup, a migration, or a CI check still wants the UNION.

## A join looks like another child

The catalog will also show a join table: two foreign keys, no meaning of its own. Ask the catalog who can point here and the join is a first-class child. Ask the delete who still points here and the join is plumbing.

The rows that matter are on the far side. Treat the join as a second hop and the incoming list becomes a path you walk. On the parent those far rows are just another incoming set. The join stays plumbing.

## The parent can list who points at it

Once the job is to make the mute parent speak, the object is the parent row. Open it in /table. The grid on that row lists who still points at it, including the far side of a join. Click a list. The next grid is those rows.

Arriving on the parent from a child is how most people get here. That hop follows the pointer that already lives on the child. It lands on the parent. The incoming lists are already on this row.

See the incoming rows. Then retry the delete. Write the UNION when the answer has to be a script. Do not start with the UNION while you are looking at the parent.
