# blogEO loop for /table

This file is an editorial runbook. It is not a public blog route. Files in `content/blog/` that start with `_` are skipped by the loader, sitemap, llms.txt, and `/blog/[slug]`.

Customer-facing posts still follow the site voice rules: no em dashes, no first-person "we", product name is `/table`, and SlashTable.app is only the Mac bundle filename. The only approved "not X" product line is that this website is not a query endpoint.

This site is static. The PR preview is the draft. Merge to main is publish. `published` is frontmatter only; it does not 404 a file that is on the branch. Do not flip `published` to preview a post.

## Loop

1. **Audit.** List search queries, agent questions, gaps in `llms.txt`, competing pages, and posts already on `/blog`. Note which engines (Postgres, MySQL, SQLite, Neon) and which workflows (local MCP, FK navigation, scoped graphs, install) lack a concrete setup article. Record current index, sitemap, and citation coverage.
2. **Generate drafts.** Add `content/blog/<kebab-slug>.md` on a PR. Required frontmatter still includes `published` as a boolean. Never invent a remote MCP URL, hosted database, or query API. A file on the branch is reviewable on the PR preview.
3. **Human approve.** A human reads the draft on the PR preview and checks voice and facts against the installed app. Merge to main is publish. Do not tell writers to flip `published` to preview. Delete a file if it should not ship.
4. **Measure at 28 and 56 days.** After merge, check impressions, queries, agent citations, and `/blog` referrals at day 28 and day 56. Feed misses and new questions back into the audit list and start the next draft.

## Draft workflow

Required frontmatter on every post file:

- `title` (string)
- `description` (SEO string)
- `publishedAt` (`YYYY-MM-DD`)
- `updatedAt` (optional `YYYY-MM-DD`)
- `published` (boolean; kept for the parser, not a route gate)
- `tags` (optional list)
- `tldr` (labelled opening summary on the public page)
- `image` (site path to a downloaded JPEG in `public/blog/`)
- `imageAlt` (accessible description)
- `imageCredit` (`Photo by <name> on Unsplash`)
- `imageCreditUrl` (Unsplash photo page)

Rules:

1. Underscore files (`_engine.md`) and `README.md` are never routes.
2. Every markdown post on the branch is on `/blog`, `/blog/<slug>`, markdown twins, sitemap, and `llms.txt`.
3. Merge to main is publish. Do not hide a post with `published: false` so a merge cannot leak it. Delete it instead.
4. After merge, set `updatedAt` when the article changes and re-measure at 28/56 days.

## Surfaces that must stay in sync

Run `bun scripts/embed-blog.ts` after changing markdown so `src/lib/blog-data.generated.ts` matches this folder. The Worker imports that module. It does not read files from disk at request time.

These read every post in the build:

- `/blog` index
- `/blog/<slug>`
- `Accept: text/markdown` twins via `/api/md/blog`
- `/sitemap.xml`
- `/llms.txt`
- footer and developers portal (index link)
