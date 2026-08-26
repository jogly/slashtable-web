import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import sitemap from "../app/sitemap";
import { BlogIndex } from "../src/components/blog/BlogIndex";
import { BlogLeaderRow } from "../src/components/blog/BlogLeaderRow";
import { BlogPostArticle } from "../src/components/blog/BlogPostArticle";
import { BLOG_SOURCES } from "../src/lib/blog-data.generated";
import {
  blogPostingLd,
  formatBlogIndexMarkdown,
  formatPostMarkdown,
  getAllPosts,
  getPostBySlug,
  isSkippedBlogFile,
  parseBlogMarkdown,
  postPath,
} from "../src/lib/blog";
import { formatJournalDate } from "../src/lib/dates";
import { buildLlmsTxt } from "../src/lib/llms";
import {
  blogMarkdownRewritePath,
  isBlogPath,
} from "../src/lib/markdown-negotiate";
import { articleMetadata, canonical } from "../src/lib/seo";

const REMOVED_SLUGS = [
  "click-through-foreign-keys",
  "local-mcp-access-to-postgres-mysql-sqlite",
  "ssh-tunnel-notes",
] as const;

const FIXTURE_RAW = `---
title: Fixture post
description: A parse fixture with required image fields.
publishedAt: 2026-08-25
published: false
tldr: Fixture TL;DR.
image: /blog/fixture-post.jpg
imageAlt: Fixture alt.
imageCredit: Photo on Unsplash
imageCreditUrl: https://unsplash.com/photos/fixture
---

## Setup

Body copy.
`;

describe("blog loader", () => {
  test("blog.ts does not read the filesystem", () => {
    const src = readFileSync(join(import.meta.dir, "../src/lib/blog.ts"), "utf8");
    expect(src).not.toContain("node:fs");
    expect(src).not.toContain("readdirSync");
    expect(src).not.toContain("readFileSync");
  });

  test("slug pages render on a Worker incremental-cache miss", () => {
    const src = readFileSync(join(import.meta.dir, "../app/blog/[slug]/page.tsx"), "utf8");
    expect(src).toContain("dynamicParams = true");
    expect(src).not.toContain("dynamicParams = false");
    expect(src).toContain("getPostBySlug");
    expect(src).toContain("getAllPosts");
    expect(src).not.toContain("getPublishedPost");
    expect(src).not.toContain("getPublishedPosts");
  });

  test("index and markdown twins list every post on the branch", () => {
    const index = readFileSync(join(import.meta.dir, "../app/blog/page.tsx"), "utf8");
    const md = readFileSync(join(import.meta.dir, "../app/api/md/blog/[slug]/route.ts"), "utf8");
    expect(index).toContain("getAllPosts");
    expect(index).not.toContain("getPublishedPosts");
    expect(md).toContain("getPostBySlug");
    expect(md).not.toContain("getPublishedPost");
  });

  test("post paths omit the trailing slash Next 308s away", () => {
    expect(postPath("example-slug")).toBe("/blog/example-slug");
  });

  test("embedded sources match content/blog markdown", () => {
    const dir = join(import.meta.dir, "../content/blog");
    const disk = readdirSync(dir)
      .filter((filename) => !isSkippedBlogFile(filename))
      .sort((a, b) => a.localeCompare(b))
      .map((filename) => ({
        slug: filename.slice(0, -3),
        raw: readFileSync(join(dir, filename), "utf8"),
      }));
    expect(BLOG_SOURCES).toEqual(disk);
  });

  test("skips underscore files and README", () => {
    expect(isSkippedBlogFile("_engine.md")).toBe(true);
    expect(isSkippedBlogFile("README.md")).toBe(true);
    expect(isSkippedBlogFile("example-post.md")).toBe(false);
  });

  test("rejected posts are deleted from the branch", () => {
    const slugs = getAllPosts().map((post) => post.slug);
    for (const slug of REMOVED_SLUGS) {
      expect(slugs).not.toContain(slug);
      expect(getPostBySlug(slug)).toBeNull();
      expect(existsSync(join(import.meta.dir, `../content/blog/${slug}.md`))).toBe(false);
      expect(existsSync(join(import.meta.dir, `../public/blog/${slug}.jpg`))).toBe(false);
    }
    expect(getAllPosts().some((post) => post.slug === "_engine")).toBe(false);
  });

  test("posts on the branch have required frontmatter and a TL;DR", () => {
    for (const post of getAllPosts()) {
      expect(post.title.length).toBeGreaterThan(0);
      expect(post.description.length).toBeGreaterThan(0);
      expect(post.tldr.length).toBeGreaterThan(0);
      expect(post.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(typeof post.published).toBe("boolean");
      expect(post.path).toBe(postPath(post.slug));
      expect(post.image).toBe(`/blog/${post.slug}.jpg`);
      expect(existsSync(join(import.meta.dir, "../public", post.image))).toBe(true);
    }
  });

  test("missing image frontmatter fails parse", () => {
    const raw = `---
title: Missing image fixture
description: A parse fixture with no feature image fields.
publishedAt: 2026-08-25
published: false
tldr: Fixture only.
---

## Draft

Body.
`;
    expect(() => parseBlogMarkdown("missing-image-fixture", raw)).toThrow(/image/);
  });

  test("published remains parseable frontmatter and does not hide a slug", () => {
    const post = parseBlogMarkdown("fixture-post", FIXTURE_RAW);
    expect(post.published).toBe(false);
    expect(post.slug).toBe("fixture-post");
  });
});

describe("blog sitemap and llms.txt", () => {
  test("sitemap lists every post in the build and omits skipped files", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain(canonical("/blog/"));
    for (const post of getAllPosts()) {
      expect(urls).toContain(canonical(post.path));
    }
    for (const slug of REMOVED_SLUGS) {
      expect(urls.some((url) => url.includes(slug))).toBe(false);
    }
    expect(urls.some((url) => url.includes("_engine"))).toBe(false);
  });

  test("llms.txt lists every post in the build", () => {
    const llms = buildLlmsTxt();
    expect(llms).toContain("https://www.slashtable.dev/blog/");
    expect(llms).not.toContain("Unpublished drafts");
    for (const post of getAllPosts()) {
      expect(llms).toContain(post.slug);
    }
    for (const slug of REMOVED_SLUGS) {
      expect(llms).not.toContain(slug);
    }
    expect(llms).not.toContain("_engine");
  });

  test("index markdown lists every post on the branch", () => {
    const md = formatBlogIndexMarkdown();
    expect(md.startsWith("# /table - Blog")).toBe(true);
    if (getAllPosts().length === 0) {
      expect(md).toContain("No posts yet.");
    }
    for (const post of getAllPosts()) {
      expect(md).toContain(post.slug);
    }
    for (const slug of REMOVED_SLUGS) {
      expect(md).not.toContain(slug);
    }
  });
});

describe("posts render H1", () => {
  test("each post on the branch renders exactly one H1 from the title", () => {
    for (const post of getAllPosts()) {
      const html = renderToStaticMarkup(createElement(BlogPostArticle, { post }));
      const headings = html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/g) ?? [];
      expect(headings).toHaveLength(1);
      expect(headings[0]).toContain(post.title);
      expect(html).not.toContain("TL;DR");
      expect(html).not.toContain("Summary");
      expect(html).not.toMatch(/border-dashed/);
      expect(html).toContain(post.image);
      expect(html).toContain("The stuck address. People, a school, and tags still point at it.");
      expect(html).not.toContain("on Unsplash");
      expect(html).not.toContain("Photo by Haberdoedas");
      expect(html).not.toContain("Sources");
      expect(html).not.toContain(post.description);
      expect(html).not.toContain("Ada");
      expect(html).not.toContain("Bea");
      expect(html).not.toContain("Linux is alpha");
      expect(html).not.toContain("pg_constraint");
      expect(html).toContain(formatJournalDate(post.publishedAt));
      expect(html).toContain("font-mono");
      expect(html).toContain("rounded-[7px]");
      expect(html).not.toContain("italic");
      expect(html).toContain("font-display");
      expect(html).toContain("scroll-mt-24");
      expect(html).toContain("#you-already-know-the-address");
      expect(html).toContain("Link to You already know the address");
      expect(html).toContain("#that-row-already-lists-them");
      expect(html).toContain("Link to That row already lists them");
      expect(html).not.toContain("#open-that-row");
      expect(html).toContain("neighbor picture");
      expect(html).not.toContain("<hr");
      expect(post.body).not.toMatch(/^https?:\/\//m);
      expect(post.body).not.toMatch(/^## .+\?$/m);
      expect(post.body).not.toMatch(/^## Sources$/m);
      if (post.body.includes("| Job |")) {
        expect(html).toContain("<table");
        expect(html).toContain("Stay in SQL");
        expect(html).toContain("Other client");
      }
      const md = formatPostMarkdown(post);
      expect(md.startsWith(`# ${post.title}`)).toBe(true);
      expect(md).not.toContain("## TL;DR");
      expect(md).not.toContain("TL;DR");
      expect(md).toContain(post.description);
      expect(post.body).not.toMatch(/^## TL;DR/m);
    }
  });

  test("fixture article still renders when the branch has zero posts", () => {
    const post = parseBlogMarkdown("fixture-post", FIXTURE_RAW);
    const html = renderToStaticMarkup(createElement(BlogPostArticle, { post }));
    expect(html).toContain("Fixture post");
    expect(html).not.toContain("TL;DR");
    expect(html).not.toContain("A parse fixture with required image fields.");
    expect(html).toContain("Body copy.");
    expect(html).toContain(formatJournalDate(post.publishedAt));
    expect(html).toContain("font-mono");
    expect(formatPostMarkdown(post)).toContain("A parse fixture with required image fields.");
    expect(formatPostMarkdown(post)).not.toContain("TL;DR");
  });
});

describe("blog index as a journal", () => {
  test("renders an h2 per post on the branch, or the empty copy", () => {
    const posts = getAllPosts();
    const html = renderToStaticMarkup(createElement(BlogIndex, { posts }));
    const h2s = html.match(/<h2\b[^>]*>[\s\S]*?<\/h2>/g) ?? [];
    expect(h2s).toHaveLength(posts.length);
    expect(html).not.toContain("<h1");
    expect(html).not.toContain("→");
    expect(html).not.toContain("grid-cols-2");
    expect(html).not.toContain("grid-cols-12");
    if (posts.length === 0) {
      expect(html).toContain("No posts yet.");
    }
    for (const slug of REMOVED_SLUGS) {
      expect(html).not.toContain(slug);
    }
    if (posts[0]) {
      expect(html).toContain(posts[0].title);
      expect(html).toContain("flex-1");
      expect(html).not.toContain(posts[0].description);
      expect(html).not.toContain(posts[0].image);
      expect(html).not.toContain("Newest");
      expect(html).not.toContain("on Unsplash");
      expect(html).not.toContain("aspect-video");
      expect(html).not.toContain("rounded-[6px]");
    }
    for (const post of posts) {
      expect(html).toContain(post.title);
      expect(html).toContain(formatJournalDate(post.publishedAt));
    }
  });

  test("every post is a leader row, including the first", () => {
    const newest = parseBlogMarkdown("fixture-post", FIXTURE_RAW);
    const laterRaw = FIXTURE_RAW.replace("Fixture post", "Older fixture").replace(
      "A parse fixture with required image fields.",
      "An older dek that must not appear on the index.",
    );
    const later = parseBlogMarkdown("older-fixture", laterRaw.replace("fixture-post.jpg", "older-fixture.jpg"));
    const html = renderToStaticMarkup(createElement(BlogIndex, { posts: [newest, later] }));
    expect(html).toContain("Fixture post");
    expect(html).toContain("Older fixture");
    expect(html).toContain("flex-1");
    expect(html).not.toContain("A parse fixture with required image fields.");
    expect(html).not.toContain("An older dek that must not appear on the index.");
    expect(html).not.toContain("Newest");
    expect(html).not.toContain("grid-cols-3");
    expect(html).not.toContain("/blog/fixture-post.jpg");
    expect(html).not.toContain("aspect-video");
  });

  test("leader row is title, 1px rule, and mono date", () => {
    const html = renderToStaticMarkup(
      createElement(BlogLeaderRow, {
        href: "/blog/fixture-post",
        title: "Fixture post",
        publishedAt: "2026-08-25",
      }),
    );
    expect(html).toContain("Fixture post");
    expect(html).toContain("flex-1");
    expect(html).toContain("border-t");
    expect(html).toContain("font-mono");
    expect(html).toContain(formatJournalDate("2026-08-25"));
  });

  test("index page is a small left heading and a compact list", () => {
    const src = readFileSync(join(import.meta.dir, "../app/blog/page.tsx"), "utf8");
    const index = readFileSync(join(import.meta.dir, "../src/components/blog/BlogIndex.tsx"), "utf8");
    expect(src).toContain("max-w-[40rem]");
    expect(src).toContain("font-display");
    expect(src).toContain("text-[1.5rem]");
    expect(src).not.toContain("text-center");
    expect(src).not.toContain("text-[2.5rem]");
    expect(src).not.toContain("text-[3.25rem]");
    expect(src).not.toContain("text-7xl");
    expect(src).not.toContain("max-w-[52rem]");
    expect(src).not.toContain("max-w-content");
    expect(src).not.toContain("tracking-widest");
    expect(src).not.toContain("h-2 w-2");
    expect(src).not.toContain("BLOG.eyebrow");
    expect(index).toContain("BlogLeaderRow");
    expect(index).not.toContain("FeaturedCard");
    expect(index).not.toContain("BLOG_ARCHIVE_AFTER");
    expect(index).not.toContain("BlogCover");
    expect(index).not.toContain("Newest");
    expect(index).not.toContain("FeaturedStory");
    expect(index).not.toContain("grid-cols-12");
    expect(index).not.toContain("grid-cols-3");
    expect(index).not.toContain("grid-cols-2");
    expect(index).not.toContain("aspect-video");
    expect(index).not.toContain("aspect-[4/5]");
    expect(index).not.toContain("→");
  });

  test("post pages use a 70ch story column and an optional rail", () => {
    const page = readFileSync(join(import.meta.dir, "../app/blog/[slug]/page.tsx"), "utf8");
    const article = readFileSync(join(import.meta.dir, "../src/components/blog/BlogPostArticle.tsx"), "utf8");
    const rail = readFileSync(join(import.meta.dir, "../src/components/blog/BlogOnThisPage.tsx"), "utf8");
    expect(page).toContain("max-w-[70ch]");
    expect(page).toContain("BlogOnThisPage");
    expect(rail).toContain("lg:block");
    expect(rail).toContain("On this page");
    expect(page).not.toContain("max-w-content");
    expect(article).toContain("font-display");
    expect(article).not.toContain("max-w-content");
    expect(article).not.toContain("max-w-3xl");
    expect(article).not.toContain("tldrEyebrow");
    expect(article).not.toContain("border-dashed");
    expect(article).not.toContain("post.tldr");
    expect(article).not.toContain("TL;DR");
    expect(article).not.toContain("post.description");
    expect(article).not.toContain("tracking-widest");
    expect(article).not.toContain("h-2 w-2");
    expect(article).not.toContain("BLOG.eyebrow");
    expect(article).not.toContain("<hr");
    expect(article).toContain("scroll-mt-24");
  });
});

describe("blog body as long-form type", () => {
  test("markdown body uses 16px type, gutter hashes, and designed tables", () => {
    const src = readFileSync(join(import.meta.dir, "../src/components/blog/BlogMarkdown.tsx"), "utf8");
    const hash = readFileSync(join(import.meta.dir, "../src/components/blog/BlogHeadingHash.tsx"), "utf8");
    const base = readFileSync(join(import.meta.dir, "../src/theme/base.css"), "utf8");
    expect(src).toContain("text-[1rem] leading-[1.6] text-text");
    expect(src).toContain("font-display");
    expect(src).toContain("BlogHeadingHash");
    expect(src).toContain("scroll-mt-24");
    expect(hash).toContain("right-full");
    expect(hash).toContain("top-1/2");
    expect(hash).toContain("-translate-y-1/2");
    expect(hash).toContain("text-[0.5em]");
    expect(hash).toContain("opacity-[0.28]");
    expect(hash).toContain("group-hover:opacity-70");
    expect(hash).toContain("Link to");
    expect(hash).not.toContain("text-[0.8em]");
    expect(hash).not.toContain("opacity-55");
    expect(src).not.toContain("border-border-strong border-b pb-3");
    expect(src).toContain("BlogFigure");
    expect(src).toContain("remarkGfm");
    expect(src).toContain("<table");
    expect(src).toContain("font-serif text-[1rem] leading-[1.6] text-text");
    expect(src).toContain("font-serif text-[1.2rem] text-text italic");
    expect(src).toContain("font-sans text-[12px] font-normal text-text-muted");
    expect(src).toContain("first:font-medium");
    expect(src).not.toContain("border-l");
    expect(src).not.toContain("<th className=\"bg-");
    expect(src).not.toContain("text-text-secondary");
    expect(src).not.toContain("font-mono text-sm");
    expect(base).toContain("scroll-padding-top: 6rem");
  });

  test("a lone markdown image becomes a framed figure with a sentence caption", () => {
    const post = parseBlogMarkdown(
      "fixture-post",
      `${FIXTURE_RAW.trim()}\n\n![The delete is stuck on this address.](/blog/fixture-post.jpg)\n`,
    );
    const html = renderToStaticMarkup(createElement(BlogPostArticle, { post }));
    expect(html).toContain("<figure");
    expect(html).toContain("The delete is stuck on this address.");
    expect(html).toContain("rounded-[7px]");
    expect(html).toContain("aspect-video");
    expect(html).toContain("object-cover");
    expect(html).not.toContain("italic");
    expect(html).not.toContain("on Unsplash");
  });

  test("figures are a wide framed window, not the full 4:5 photo", () => {
    const src = readFileSync(join(import.meta.dir, "../src/components/blog/BlogFigure.tsx"), "utf8");
    expect(src).toContain("rounded-[7px]");
    expect(src).toContain("border-border");
    expect(src).toContain("aspect-video");
    expect(src).toContain("object-cover");
    expect(src).toContain("object-right");
    expect(src).not.toContain("h-auto w-full");
    expect(src).not.toContain("italic");
  });

  test("reading serif is article body only", () => {
    const markdown = readFileSync(join(import.meta.dir, "../src/components/blog/BlogMarkdown.tsx"), "utf8");
    const figure = readFileSync(join(import.meta.dir, "../src/components/blog/BlogFigure.tsx"), "utf8");
    const index = readFileSync(join(import.meta.dir, "../app/blog/page.tsx"), "utf8");
    const row = readFileSync(join(import.meta.dir, "../src/components/blog/BlogLeaderRow.tsx"), "utf8");
    const hero = readFileSync(join(import.meta.dir, "../src/components/sections/Hero.tsx"), "utf8");
    expect(markdown).toContain("font-serif");
    expect(figure).not.toContain("font-serif");
    expect(index).not.toContain("font-serif");
    expect(row).not.toContain("font-serif");
    expect(hero).not.toContain("font-serif");
  });
});

describe("blog image metadata", () => {
  test("JSON-LD and article metadata include the feature image URL", () => {
    for (const post of getAllPosts()) {
      const ld = blogPostingLd(post);
      expect(ld.image).toBe(canonical(post.image));
      const meta = articleMetadata({
        title: post.title,
        description: post.description,
        path: post.path,
        publishedAt: post.publishedAt,
        updatedAt: post.updatedAt,
        tags: post.tags,
        image: post.image,
        imageAlt: post.imageAlt,
        imageWidth: post.imageWidth,
        imageHeight: post.imageHeight,
      });
      expect(meta.openGraph?.images).toEqual([
        { url: canonical(post.image), alt: post.imageAlt, width: post.imageWidth, height: post.imageHeight },
      ]);
    }
  });
});

describe("blog markdown negotiation paths", () => {
  test("rewrites /blog and post slugs to the markdown twin", () => {
    expect(isBlogPath("/blog")).toBe(true);
    expect(isBlogPath("/blog/")).toBe(true);
    expect(isBlogPath("/blog/example-slug")).toBe(true);
    expect(isBlogPath("/blog/example-slug/")).toBe(true);
    expect(isBlogPath("/blog/a/b")).toBe(false);
    expect(blogMarkdownRewritePath("/blog/")).toBe("/api/md/blog");
    expect(blogMarkdownRewritePath("/blog/example-slug/")).toBe("/api/md/blog/example-slug");
  });
});

describe("post voice", () => {
  test("avoids em dashes, first-person we, and SlashTable product naming", () => {
    for (const post of getAllPosts()) {
      const text = [post.title, post.description, post.tldr, post.body].join("\n");
      expect(text).not.toMatch(/[\u2013\u2014]/);
      expect(text).not.toMatch(/\bwe\b/i);
      expect(text).not.toMatch(/\bour\b/i);
      expect(text).not.toMatch(/SlashTable(?!\.app)/);
      expect(text).not.toMatch(/v?0\.5\.\d+/);
    }
  });
});
