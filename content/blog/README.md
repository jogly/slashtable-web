# /table blog CMS

Markdown in this folder is the CMS. There is no hosted editorial tool.

This site is static. The PR preview is the draft. Merge to main is publish. `published` is not a route gate.

## Add a post

1. Create `content/blog/<kebab-slug>.md` on a PR.
2. Fill frontmatter. Required strings include `image`, `imageAlt`, `imageCredit`, and `imageCreditUrl`. Download the JPEG into `public/blog/` and add a line to `public/blog/ATTRIBUTION.md`. Keep the `published` boolean for the parser.
3. Write the body in H2/H3 sections. The page template supplies the H1, the feature image, and the labelled TL;DR from `tldr`.
4. Review on the PR preview. Merge when the post should go live.

Files starting with `_` and `README.md` are not public routes. Every other markdown post on the branch is a public `/blog/<slug>` route.

If a post should not ship, delete the file. Do not hide it with `published: false`.

After adding or editing a post, regenerate the Worker bundle source:

```
bun scripts/embed-blog.ts
```

The OpenNext build runs that script before `next build`. Markdown in this folder stays the CMS; `src/lib/blog-data.generated.ts` is the embedded copy the Worker imports.

See [_engine.md](./_engine.md) for the audit → PR draft → merge publish → 28/56-day measure loop.
