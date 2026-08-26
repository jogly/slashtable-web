---
title: How do I find all rows that reference this Postgres row
description: See every row that still points at a Postgres parent before you retry the delete.
publishedAt: 2026-08-25
published: false
tldr: Postgres refused a delete because other rows still point at the parent. The catalog names the tables. The incoming list, including a join that is not its own hop, sits on that parent. Write the UNION only when the answer has to be a script.
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

Postgres will not delete a row that other rows still point at. The error sometimes names one child table. Sometimes it names nothing. It could be one of ten other tables. Either way the parent is still there, and the delete is still stuck.

The catalog can list every table that is allowed to point here. It cannot list the rows that actually do.

![The parent is still in the table. The unknown is who still points at it.](/blog/find-rows-that-reference-this-postgres-row.jpg)

## The catalog knows the tables. The delete needs the rows.

A `UNION` of every table with a foreign key to this one is the right artifact once those tables are known. It is the wrong first move when they are not. You can list every incoming constraint and still not have the rows that block the delete.

That is the Stack Overflow answer for this job: query each child you already know, or generate that UNION from the catalog. It answers which tables can point here. It does not answer which rows still do.

A [References panel](https://dbeaver.com/docs/dbeaver/References-Panel/) or [Go To Related Rows](https://www.jetbrains.com/help/datagrip/rows.html) hops once. That is enough when Postgres already named the one child and that hop is the whole job. A script still wants the UNION. Neither shows the incoming rows while you are looking at the parent.

## The incoming list sits on the parent

Open that parent in /table. On the same row the grid lists who still points at it. Click a list. The next grid is those rows.

Arriving on the parent from a child is how most people get here. That hop lands on the parent. It does not list who else still points at it. Do not treat that hop as the answer.

## A join is not a second hop

Some of the incoming rows only reach this parent through a join. On this row they show up as that related set, not as a pivot you hop through and then hop again. Direct children are ordinary child tables. The join does not get a seat.

That is the whole job: see the incoming rows, then retry the delete.
