---
title: How do I find all rows that reference this Postgres row
description: Open the parent. The incoming lists are already on the row.
publishedAt: 2026-08-25
published: false
tldr: Click the parent. The lists on that row are the incoming set. Write the UNION when the answer has to be a script.
demand_query: how do I find all rows that reference this postgres row
cluster: fk-navigation
demand_urls:
  - https://stackoverflow.com/questions/558283/how-do-i-find-all-references-from-other-tables-to-a-specific-row
  - https://stackoverflow.com/questions/14357121/get-all-the-rows-referencing-via-foreign-keys-a-particular-row-in-a-table
session_log: session.md
image: /blog/find-rows-nav-incoming.png
imageAlt: Incoming people, tags, and a school listed on an address row
---

```text
ERROR: update or delete on table "address" violates foreign key constraint "person_address_id_fkey" on table "person"
DETAIL: Key (id)=(1) is still referenced from table "person".
```

The engine named one child and stopped. Open that parent in /table. The rest of the set is already listed on the row.

## The address is a hop

On a person, the address is an orange `1 →`. Click it. The bar keeps the path.

![Two people pointing at the same address](/blog/find-rows-nav-outbound.png)

## The parent lists who still points here

The address lists the incoming set: two people, a school, two tags. Click people.

![Incoming people, tags, and a school on the parent](/blog/find-rows-nav-incoming.png)

## The next grid is those rows

The path is still on the bar. The next grid is the people who still point here.

![People reached from the parent](/blog/find-rows-nav-people.png)

Tags reach this parent through a join. They show up as tags on this row.

Write the [UNION](https://stackoverflow.com/questions/558283/how-do-i-find-all-references-from-other-tables-to-a-specific-row) when the answer has to be a script. When you are on the row, the lists are the set.
