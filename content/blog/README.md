# /table blog CMS

Markdown in this folder is the CMS. There is no hosted editorial tool.

## Add a draft

1. Create `content/blog/<kebab-slug>.md`.
2. Fill frontmatter. Set `published: false`.
3. Write the body in H2/H3 sections. The page template supplies the H1 and the labelled TL;DR from `tldr`.
4. Open a PR. Do not flip `published: true` while generating the draft.

Files starting with `_` and `README.md` are not public routes.

## Publish

A human reviews the draft and opens a PR that sets `published: true`. That is the only gate. Drafts 404 on `/blog/<slug>` and are omitted from the index, sitemap, and `llms.txt`.

After adding or editing a post, regenerate the Worker bundle source:

```
bun scripts/embed-blog.ts
```

The OpenNext build runs that script before `next build`. Markdown in this folder stays the CMS; `src/lib/blog-data.generated.ts` is the embedded copy the Worker imports.

See [_engine.md](./_engine.md) for the audit → draft → human publish → 28/56-day measure loop.
