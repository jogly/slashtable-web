---
title: How do I find all rows that reference this Postgres row
description: See every row that still points at a Postgres address before you retry the delete.
publishedAt: 2026-08-25
published: false
tldr: Postgres refused to delete 100 Main St. The five rows that still point at it are on that address: two people, a school, two tags through a join. Write the UNION only when the answer has to be a script.
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

Postgres refused to delete 100 Main St. Other rows still point at that address. Sometimes the error names one child table. Sometimes it names nothing. Either way the address is still there, and the delete is still stuck.

The unknown is not the address. The unknown is who still points here: two people, a school, and two tags that reach this row through a join.

![The stuck address. People, a school, and tags still point at it.](/blog/find-rows-that-reference-this-postgres-row.jpg)

## The catalog knows the tables. The delete needs the rows.

A `UNION` of every table with a foreign key to this one is the right artifact once those tables are known. It is the wrong first move when they are not. You can list every incoming constraint and still not have the five rows that block this delete.

A [References panel](https://dbeaver.com/docs/dbeaver/References-Panel/) or [Go To Related Rows](https://www.jetbrains.com/help/datagrip/rows.html) hops once. That is enough when Postgres already named the one child and that hop is the whole job. A script still wants the UNION. Neither shows the five rows on 100 Main St while you are looking at it.

## The incoming list is on 100 Main St

Open the address table in /table. 100 Main St is already there. On that same row the grid lists who still points at it: two people, a school, two tags.

Click the people list. The next grid is the two people who still live at 100 Main St. The school opens the same way.

Arriving on 100 Main St from a person row is how most people get here. That hop lands on the address. It does not list who else still points at it. Do not treat that hop as the answer.

## The tags are not a stop of their own

Two of the five incoming rows are tags. They reach 100 Main St through a join. On this row they show up as tags, not as a pivot you hop through and then hop again. The people and the school are ordinary child tables. The join does not get a seat.

That is the whole job: see the five rows, then retry the delete.
