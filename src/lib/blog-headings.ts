export function blogHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function extractBlogH2s(body: string): { id: string; text: string }[] {
  return [...body.matchAll(/^##[ \t]+(.+?)\s*$/gm)].map((match) => ({
    text: match[1],
    id: blogHeadingId(match[1]),
  }));
}
