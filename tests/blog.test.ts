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
      expect(html).toContain("TL;DR");
      expect(html).not.toContain("Summary");
      expect(html).not.toMatch(/border-dashed/);
      expect(html).toContain(post.image);
      expect(html).toContain(post.imageCreditUrl);
      expect(html).toContain("on Unsplash");
      expect(html).toContain(post.tldr);
      expect(html).not.toContain(post.description);
      const md = formatPostMarkdown(post);
      expect(md.startsWith(`# ${post.title}`)).toBe(true);
      expect(md).toContain("## TL;DR");
      expect(md).toContain(post.tldr);
      expect(md).not.toContain(post.description);
      expect(post.body).not.toMatch(/^## TL;DR/m);
    }
  });

  test("fixture article still renders when the branch has zero posts", () => {
    const post = parseBlogMarkdown("fixture-post", FIXTURE_RAW);
    const html = renderToStaticMarkup(createElement(BlogPostArticle, { post }));
    expect(html).toContain("Fixture post");
    expect(html).toContain("TL;DR");
    expect(html).toContain("text-base text-text leading-7");
    expect(html).not.toContain("A parse fixture with required image fields.");
    expect(formatPostMarkdown(post)).not.toContain("A parse fixture with required image fields.");
  });
});

describe("blog index magazine layout", () => {
  test("renders an h2 per post on the branch, or the empty copy", () => {
    const posts = getAllPosts();
    const html = renderToStaticMarkup(createElement(BlogIndex, { posts }));
    const h2s = html.match(/<h2\b[^>]*>[\s\S]*?<\/h2>/g) ?? [];
    expect(h2s).toHaveLength(posts.length);
    expect(html).not.toContain("<h1");
    if (posts.length === 0) {
      expect(html).toContain("No posts yet.");
    }
    for (const slug of REMOVED_SLUGS) {
      expect(html).not.toContain(slug);
    }
    for (const post of posts) {
      expect(html).toContain(post.image);
      expect(html).toContain(post.title);
      expect(html).toContain(post.description);
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
    expect(article).not.toContain("post.description");
  });
});

describe("blog body contrast", () => {
  test("markdown body uses 16px full-contrast text", () => {
    const src = readFileSync(join(import.meta.dir, "../src/components/blog/BlogMarkdown.tsx"), "utf8");
    expect(src).toContain("text-base text-text leading-7");
    expect(src).not.toContain("text-text-secondary");
    expect(src).not.toContain("text-text-muted");
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
