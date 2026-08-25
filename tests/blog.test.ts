import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import sitemap from "../app/sitemap";
import { BlogIndex } from "../src/components/blog/BlogIndex";
import { BlogPostArticle } from "../src/components/blog/BlogPostArticle";
import { BLOG_SOURCES } from "../src/lib/blog-data.generated";
import {
  blogPostingLd,
  formatBlogIndexMarkdown,
  formatPostMarkdown,
  getAllPosts,
  getPostBySlug,
  getPublishedPost,
  getPublishedPosts,
  isSkippedBlogFile,
  parseBlogMarkdown,
  postPath,
} from "../src/lib/blog";
import { buildLlmsTxt } from "../src/lib/llms";
import {
  blogMarkdownRewritePath,
  isBlogPath,
} from "../src/lib/markdown-negotiate";
import { articleMetadata, canonical } from "../src/lib/seo";

const PUBLISHED_SLUGS = [
  "local-mcp-access-to-postgres-mysql-sqlite",
  "click-through-foreign-keys",
] as const;
const DRAFT_SLUG = "ssh-tunnel-notes";

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
  });

  test("post paths omit the trailing slash Next 308s away", () => {
    expect(postPath("click-through-foreign-keys")).toBe("/blog/click-through-foreign-keys");
    expect(postPath("local-mcp-access-to-postgres-mysql-sqlite")).toBe(
      "/blog/local-mcp-access-to-postgres-mysql-sqlite",
    );
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
    expect(isSkippedBlogFile("local-mcp-access-to-postgres-mysql-sqlite.md")).toBe(false);
  });

  test("drafts are excluded from the published index", () => {
    const published = getPublishedPosts();
    const slugs = published.map((post) => post.slug);

    expect(published.every((post) => post.published)).toBe(true);
    expect(new Set(slugs)).toEqual(new Set(PUBLISHED_SLUGS));
    expect(slugs).toContain(PUBLISHED_SLUGS[0]);
    expect(slugs).toContain(PUBLISHED_SLUGS[1]);
    expect(slugs).not.toContain(DRAFT_SLUG);
    expect(getPublishedPost(DRAFT_SLUG)).toBeNull();

    const draft = getPostBySlug(DRAFT_SLUG);
    expect(draft).toBeTruthy();
    expect(draft?.published).toBe(false);

    expect(getAllPosts().some((post) => post.slug === "_engine")).toBe(false);
  });

  test("published posts have required frontmatter and a TL;DR", () => {
    for (const post of getPublishedPosts()) {
      expect(post.title.length).toBeGreaterThan(0);
      expect(post.description.length).toBeGreaterThan(0);
      expect(post.tldr.length).toBeGreaterThan(0);
      expect(post.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(post.path).toBe(postPath(post.slug));
    }
  });

  test("every post including drafts has a downloaded feature image", () => {
    const publicRoot = join(import.meta.dir, "../public");
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThan(0);
    expect(posts.some((post) => post.slug === DRAFT_SLUG)).toBe(true);

    for (const post of posts) {
      expect(post.image).toBe(`/blog/${post.slug}.jpg`);
      expect(post.imageAlt.length).toBeGreaterThan(0);
      expect(post.imageCredit).toMatch(/^Photo( by .+)? on Unsplash$/);
      expect(post.imageCreditUrl.startsWith("https://unsplash.com/photos/")).toBe(true);
      expect(existsSync(join(publicRoot, post.image))).toBe(true);
    }

    expect(getPublishedPost("click-through-foreign-keys")?.imageAlt).toContain("Tree roots");
    expect(getPublishedPost("local-mcp-access-to-postgres-mysql-sqlite")?.imageAlt).toContain("laptop");
    expect(getPublishedPost("click-through-foreign-keys")?.imageAlt).not.toMatch(/Manhattan|sunset/i);
    expect(getPublishedPost("local-mcp-access-to-postgres-mysql-sqlite")?.imageAlt).not.toMatch(/server rack/i);
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
});

describe("blog sitemap and llms.txt", () => {
  test("drafts are excluded from the sitemap", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain(canonical("/blog/"));
    expect(urls).toContain(canonical("/blog/local-mcp-access-to-postgres-mysql-sqlite"));
    expect(urls).toContain(canonical("/blog/click-through-foreign-keys"));
    expect(urls.some((url) => url.includes(DRAFT_SLUG))).toBe(false);
    expect(urls.some((url) => url.includes("_engine"))).toBe(false);
  });

  test("drafts are excluded from llms.txt", () => {
    const llms = buildLlmsTxt();
    expect(llms).toContain("https://www.slashtable.dev/blog/");
    expect(llms).toContain("local-mcp-access-to-postgres-mysql-sqlite");
    expect(llms).toContain("click-through-foreign-keys");
    expect(llms).not.toContain(DRAFT_SLUG);
    expect(llms).not.toContain("_engine");
  });

  test("index markdown lists published posts only", () => {
    const md = formatBlogIndexMarkdown();
    expect(md.startsWith("# /table - Blog")).toBe(true);
    expect(md).toContain(PUBLISHED_SLUGS[0]);
    expect(md).toContain(PUBLISHED_SLUGS[1]);
    expect(md).not.toContain(DRAFT_SLUG);
  });
});

describe("published posts render H1", () => {
  test("each published post renders exactly one H1 from the title", () => {
    for (const post of getPublishedPosts()) {
      const html = renderToStaticMarkup(createElement(BlogPostArticle, { post }));
      const headings = html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/g) ?? [];
      expect(headings).toHaveLength(1);
      expect(headings[0]).toContain(post.title);
      expect(html).toContain("TL;DR");
      expect(html).not.toContain("Summary");
      expect(html).not.toMatch(/border-dashed/);
      expect(html).toContain(post.image);
      expect(html).toContain(post.imageCreditUrl);
      expect(html).toContain("on Unsplash");
      expect(formatPostMarkdown(post).startsWith(`# ${post.title}`)).toBe(true);
      expect(post.body).not.toMatch(/^## TL;DR/m);
    }
  });
});

describe("blog index magazine layout", () => {
  test("renders one h1, an h2 per published post, and feature images", () => {
    const posts = getPublishedPosts();
    const html = renderToStaticMarkup(createElement(BlogIndex, { posts }));
    const h2s = html.match(/<h2\b[^>]*>[\s\S]*?<\/h2>/g) ?? [];
    expect(h2s).toHaveLength(posts.length);
    expect(html).not.toContain("<h1");
    expect(html).not.toContain(DRAFT_SLUG);
    for (const post of posts) {
      expect(html).toContain(post.image);
      expect(html).toContain(post.title);
      expect(html).toContain(post.imageCreditUrl);
    }
  });

  test("index page source uses the wide content measure", () => {
    const src = readFileSync(join(import.meta.dir, "../app/blog/page.tsx"), "utf8");
    expect(src).toContain("max-w-content");
    expect(src).not.toContain("max-w-narrow");
  });

  test("post pages use one narrow column", () => {
    const page = readFileSync(join(import.meta.dir, "../app/blog/[slug]/page.tsx"), "utf8");
    const article = readFileSync(join(import.meta.dir, "../src/components/blog/BlogPostArticle.tsx"), "utf8");
    expect(page).toContain("max-w-narrow");
    expect(page).not.toContain("max-w-content");
    expect(article).not.toContain("max-w-content");
    expect(article).not.toContain("max-w-3xl");
    expect(article).not.toContain("max-w-narrow");
    expect(article).not.toContain("tldrEyebrow");
    expect(article).not.toContain("border-dashed");
  });
});

describe("blog body contrast", () => {
  test("markdown body uses 16px full-contrast text", () => {
    const src = readFileSync(join(import.meta.dir, "../src/components/blog/BlogMarkdown.tsx"), "utf8");
    expect(src).toContain("text-base text-text leading-7");
    expect(src).not.toContain("text-text-secondary");
    expect(src).not.toContain("text-text-muted");
    const post = getPublishedPosts()[0]!;
    const html = renderToStaticMarkup(createElement(BlogPostArticle, { post }));
    expect(html).toContain("text-base text-text leading-7");
  });
});

describe("blog image metadata", () => {
  test("JSON-LD and article metadata include the feature image URL", () => {
    for (const post of getPublishedPosts()) {
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
  test("rewrites /blog and published slugs to the markdown twin", () => {
    expect(isBlogPath("/blog")).toBe(true);
    expect(isBlogPath("/blog/")).toBe(true);
    expect(isBlogPath("/blog/local-mcp-access-to-postgres-mysql-sqlite")).toBe(true);
    expect(isBlogPath("/blog/local-mcp-access-to-postgres-mysql-sqlite/")).toBe(true);
    expect(isBlogPath("/blog/a/b")).toBe(false);
    expect(blogMarkdownRewritePath("/blog/")).toBe("/api/md/blog");
    expect(blogMarkdownRewritePath("/blog/click-through-foreign-keys/")).toBe(
      "/api/md/blog/click-through-foreign-keys",
    );
  });
});

describe("published post depth", () => {
  test("MCP post documents local HTTP on 27420, not a stdio command block", () => {
    const post = getPublishedPost("local-mcp-access-to-postgres-mysql-sqlite");
    expect(post).toBeTruthy();
    expect(post?.description).toContain("local HTTP");
    expect(post?.tldr).toContain("http://127.0.0.1:27420/mcp");
    expect(post?.body).toContain('"type": "http"');
    expect(post?.body).toContain("claude mcp add slashtable --transport http");
    expect(post?.body).toContain("## FAQ");
    expect(post?.body).toMatch(/^### /m);
    expect(post?.body).toContain("Do not change `type` to `stdio` or add a `command` field.");
  });

  test("foreign-key post has nested setup, FAQ, and the scoped graph tool", () => {
    const post = getPublishedPost("click-through-foreign-keys");
    expect(post).toBeTruthy();
    expect(post?.tldr).toContain("get_schema_graph");
    expect(post?.body).toContain("## FAQ");
    expect(post?.body).toMatch(/^### /m);
    expect(post?.body).toContain("⌘Shift+G");
    expect(post?.body).toContain("http://127.0.0.1:27420/mcp");
  });
});

describe("published post voice", () => {
  test("avoids em dashes, first-person we, and SlashTable product naming", () => {
    for (const post of getPublishedPosts()) {
      const text = [post.title, post.description, post.tldr, post.body].join("\n");
      expect(text).not.toMatch(/[\u2013\u2014]/);
      expect(text).not.toMatch(/\bwe\b/i);
      expect(text).not.toMatch(/\bour\b/i);
      expect(text).not.toMatch(/SlashTable(?!\.app)/);
    }
  });
});
