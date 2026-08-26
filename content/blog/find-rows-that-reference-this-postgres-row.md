---
title: How do I find all rows that reference this Postgres row
description: Open the parent and walk. The incoming lists are already on the row.
publishedAt: 2026-08-25
published: false
tldr: Click through the parent. The lists on that row are the incoming set. Write the UNION when the answer has to be a script.
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

You tried to delete an address. Postgres named a person and stopped. You cleaned the people, retried, and a school was still there. The error only ever names one table.

If the answer has to run later, ask every child. The [thread that owns this question](https://stackoverflow.com/questions/558283/how-do-i-find-all-references-from-other-tables-to-a-specific-row) builds a UNION from the catalog so each child is asked once.

If you are on the address, the children are already on the row.

## Walk from the parent

A foreign key on a child is a hop. On a person the address is an orange `1 →`. Click it. The bar keeps the path from the row you came from.

![Two people pointing at the same address](/blog/find-rows-nav-outbound.png)

The parent then lists who still points here. People, a school, tags. Each cell is a count. Click people and the next grid is those rows. The path stays on the bar, so the parent is still one hop back.

![Incoming people, tags, and a school on the parent](/blog/find-rows-nav-incoming.png)

![People reached from the parent](/blog/find-rows-nav-people.png)

Tags reach this parent through a join. They still show up in the tag count on this row.

Write the UNION when you need a script. When you are on the row, click the counts.
