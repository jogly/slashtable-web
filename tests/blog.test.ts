import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import sitemap from "../app/sitemap";
import { BlogPostArticle } from "../src/components/blog/BlogPostArticle";
import {
  formatBlogIndexMarkdown,
  formatPostMarkdown,
  getAllPosts,
  getPostBySlug,
  getPublishedPost,
  getPublishedPosts,
  isSkippedBlogFile,
  postPath,
} from "../src/lib/blog";
import { buildLlmsTxt } from "../src/lib/llms";
import {
  blogMarkdownRewritePath,
  isBlogPath,
} from "../src/lib/markdown-negotiate";
import { canonical } from "../src/lib/seo";

const PUBLISHED_SLUGS = [
  "local-mcp-access-to-postgres-mysql-sqlite",
  "click-through-foreign-keys",
] as const;
const DRAFT_SLUG = "ssh-tunnel-notes";

describe("blog loader", () => {
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
});

describe("blog sitemap and llms.txt", () => {
  test("drafts are excluded from the sitemap", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain(canonical("/blog/"));
    expect(urls).toContain(canonical("/blog/local-mcp-access-to-postgres-mysql-sqlite/"));
    expect(urls).toContain(canonical("/blog/click-through-foreign-keys/"));
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
      expect(formatPostMarkdown(post).startsWith(`# ${post.title}`)).toBe(true);
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
