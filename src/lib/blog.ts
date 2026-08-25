import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { SITE_URL } from "./constants";
import { parseFrontmatter } from "./frontmatter";
import { canonical } from "./seo";

export const BLOG_DIR = join(process.cwd(), "content/blog");

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  published: boolean;
  tags: string[];
  tldr: string;
  body: string;
  path: string;
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

let cachedPosts: BlogPost[] | null = null;

export function resetBlogCache(): void {
  cachedPosts = null;
}

export function isSkippedBlogFile(filename: string): boolean {
  if (!filename.endsWith(".md")) return true;
  if (filename.startsWith("_")) return true;
  if (filename.toLowerCase() === "readme.md") return true;
  return false;
}

export function postPath(slug: string): string {
  return `/blog/${slug}/`;
}

export function postUrl(slug: string): string {
  return canonical(postPath(slug));
}

function requireString(data: Record<string, unknown>, key: string, slug: string): string {
  const value = data[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Post "${slug}" is missing string frontmatter "${key}"`);
  }
  return value.trim();
}

function parseTags(value: unknown): string[] {
  if (value === undefined) return [];
  if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
    return value.map((item) => item.trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  throw new Error("tags must be a list or comma-separated string");
}

export function parseBlogMarkdown(slug: string, raw: string): BlogPost {
  if (!SLUG_RE.test(slug)) {
    throw new Error(`Invalid blog slug "${slug}"`);
  }

  const { data, body } = parseFrontmatter(raw);
  const title = requireString(data, "title", slug);
  const description = requireString(data, "description", slug);
  const publishedAt = requireString(data, "publishedAt", slug);
  const tldr = requireString(data, "tldr", slug);

  if (!DATE_RE.test(publishedAt)) {
    throw new Error(`Post "${slug}" has invalid publishedAt "${publishedAt}"`);
  }

  const updatedAt = typeof data.updatedAt === "string" && data.updatedAt.trim() !== "" ? data.updatedAt.trim() : undefined;
  if (updatedAt && !DATE_RE.test(updatedAt)) {
    throw new Error(`Post "${slug}" has invalid updatedAt "${updatedAt}"`);
  }

  if (typeof data.published !== "boolean") {
    throw new Error(`Post "${slug}" must set published to true or false`);
  }

  return {
    slug,
    title,
    description,
    publishedAt,
    ...(updatedAt ? { updatedAt } : {}),
    published: data.published,
    tags: parseTags(data.tags),
    tldr,
    body: body.trim(),
    path: postPath(slug),
  };
}

export function loadAllPosts(): BlogPost[] {
  if (cachedPosts) return cachedPosts;

  const files = readdirSync(BLOG_DIR);
  const posts: BlogPost[] = [];

  for (const filename of files) {
    if (isSkippedBlogFile(filename)) continue;
    const slug = filename.slice(0, -3);
    const raw = readFileSync(join(BLOG_DIR, filename), "utf8");
    posts.push(parseBlogMarkdown(slug, raw));
  }

  posts.sort((a, b) => {
    if (a.publishedAt === b.publishedAt) return a.slug.localeCompare(b.slug);
    return a.publishedAt < b.publishedAt ? 1 : -1;
  });

  cachedPosts = posts;
  return posts;
}

export function getAllPosts(): BlogPost[] {
  return loadAllPosts();
}

export function getPublishedPosts(): BlogPost[] {
  return loadAllPosts().filter((post) => post.published);
}

export function getPostBySlug(slug: string): BlogPost | null {
  return loadAllPosts().find((post) => post.slug === slug) ?? null;
}

export function getPublishedPost(slug: string): BlogPost | null {
  const post = getPostBySlug(slug);
  if (!post || !post.published) return null;
  return post;
}

export function formatPostMarkdown(post: BlogPost): string {
  const tags = post.tags.length > 0 ? `\nTags: ${post.tags.join(", ")}` : "";
  const updated = post.updatedAt ? `\nUpdated: ${post.updatedAt}` : "";
  return `# ${post.title}

${post.description}

Published: ${post.publishedAt}${updated}${tags}

## TL;DR

${post.tldr}

${post.body}
`.trim();
}

export function formatBlogIndexMarkdown(posts: BlogPost[] = getPublishedPosts()): string {
  const list =
    posts.length === 0
      ? "No published posts yet."
      : posts
          .map((post) => `- [${post.title}](${postUrl(post.slug)}): ${post.description}`)
          .join("\n");

  return `# /table - Blog

Engineering notes for product engineers using the local /table desktop client. Platforms: macOS and Linux (alpha). Engines: PostgreSQL, MySQL, SQLite, and Neon.

/table is a local app. Agents reach data only through the MCP server that runs inside the installed app, over stdio. This website is not a query endpoint.

## Posts

${list}

## Links

- Home: ${SITE_URL}/
- Blog: ${SITE_URL}/blog/
- Developers: ${SITE_URL}/developers/
- llms.txt: ${SITE_URL}/llms.txt
`.trim();
}

export function blogSitemapEntries() {
  return getPublishedPosts().map((post) => ({
    url: postUrl(post.slug),
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
}

export function blogPostingLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    url: postUrl(post.slug),
    mainEntityOfPage: postUrl(post.slug),
    inLanguage: "en-US",
    author: {
      "@type": "Organization",
      name: "Make Toast LLC",
      url: SITE_URL,
    },
    publisher: { "@id": `${SITE_URL}#organization` },
    keywords: post.tags,
  };
}

export function blogCollectionLd(posts: BlogPost[] = getPublishedPosts()) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "/table blog",
    url: canonical("/blog/"),
    description: "Engineering notes for the local /table desktop database client.",
    publisher: { "@id": `${SITE_URL}#organization` },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      url: postUrl(post.slug),
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
    })),
  };
}
