# blogEO loop for /table

This file is an editorial runbook. It is not a public blog route. Files in `content/blog/` that start with `_` are skipped by the loader, sitemap, llms.txt, and `/blog/[slug]`.

Customer-facing posts still follow the site voice rules: no em dashes, no first-person "we", product name is `/table`, and SlashTable.app is only the Mac bundle filename. The only approved "not X" product line is that this website is not a query endpoint.

## Loop

1. **Audit.** List search queries, agent questions, gaps in `llms.txt`, competing pages, and posts already on `/blog`. Note which engines (Postgres, MySQL, SQLite, Neon) and which workflows (local MCP, FK navigation, scoped graphs, install) lack a concrete setup article. Record current index, sitemap, and citation coverage.
2. **Generate drafts.** Add `content/blog/<kebab-slug>.md` with required frontmatter and `published: false`. Open a PR for the draft if review is needed. Never set `published: true` in the generation step. Never invent a remote MCP URL, hosted database, or query API.
3. **Human approve.** A human reads the draft, checks voice and facts against the installed app, then opens or updates a PR that flips `published: true`. That flag is the only public gate. Until it is true, the slug 404s and stays out of the index, sitemap, and llms.txt.
4. **Measure at 28 and 56 days.** After publish, check impressions, queries, agent citations, and `/blog` referrals at day 28 and day 56. Feed misses and new questions back into the audit list and start the next draft.

## Draft workflow

Required frontmatter on every post file:

- `title` (string)
- `description` (SEO string)
- `publishedAt` (`YYYY-MM-DD`)
- `updatedAt` (optional `YYYY-MM-DD`)
- `published` (boolean)
- `tags` (optional list)
- `tldr` (labelled opening summary on the public page)
- `image` (site path to a downloaded JPEG in `public/blog/`)
- `imageAlt` (accessible description)
- `imageCredit` (`Photo by <name> on Unsplash`)
- `imageCreditUrl` (Unsplash photo page)

Rules:

1. New files default to `published: false`.
2. Underscore files (`_engine.md`) and `README.md` are never routes.
3. A draft can merge with `published: false`. Search engines and agents will not see it.
4. Publish is a second, human PR (or human commit on the same PR) that changes only what review approved, including `published: true`.
5. After publish, set `updatedAt` when the article changes and re-measure at 28/56 days.

## Surfaces that must stay in sync

Run `bun scripts/embed-blog.ts` after changing markdown so `src/lib/blog-data.generated.ts` matches this folder. The Worker imports that module. It does not read files from disk at request time.

When a post flips to published, these read the loader and pick it up on the next build:

- `/blog` index
- `/blog/<slug>`
- `Accept: text/markdown` twins via `/api/md/blog`
- `/sitemap.xml`
- `/llms.txt`
- footer and developers portal (index link)

If a post should disappear, set `published: false` again. Do not delete the file unless the slug should go away entirely.
