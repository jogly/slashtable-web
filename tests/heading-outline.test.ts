import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
function read(rel: string) {
  return readFileSync(join(root, rel), "utf8");
}

describe("homepage heading outline (source)", () => {
  test("visible group h2 buckets with demoted feature h3 titles", () => {
    for (const rel of [
      "src/components/sections/ConnectSection.tsx",
      "src/components/sections/NavigationSection.tsx",
      "src/components/sections/PluginSection.tsx",
    ]) {
      const src = read(rel);
      expect(src).toMatch(/<h2[\s\n]*id=\{groupHeadingId\}/);
      expect(src).toMatch(/font-display text-xl text-text lg:text-2xl/);
      expect(src).toMatch(/<h3 className="[^"]*font-display text-3xl/);
      expect(src).not.toMatch(/<h2 className="[^"]*font-display text-3xl/);
    }
  });

  test("ValuePillars unwraps pillar h3s from anchors", () => {
    const src = read("src/components/sections/ValuePillars.tsx");
    expect(src).toMatch(/<h2[^>]*id="value-pillars-heading"/);
    expect(src).not.toMatch(/<a[\s\S]*?<h3/);
  });

  test("Schema/MCP/Features/Download demote large titles to h3", () => {
    for (const rel of [
      "src/components/sections/SchemaGraphSection.tsx",
      "src/components/sections/McpSection.tsx",
      "src/components/sections/FeaturesGrid.tsx",
    ]) {
      const src = read(rel);
      expect(src).toMatch(/<h3 className="[^"]*font-display text-3xl/);
      expect(src).not.toMatch(/<h2 className="[^"]*font-display text-3xl/);
    }
    const download = read("src/components/sections/DownloadSection.tsx");
    expect(download).toMatch(/<h3 className="font-display text-3xl text-text lg:text-5xl">/);
  });

  test("subsection titles are h3 at text-base", () => {
    expect(read("src/components/sections/ConnectSection.tsx")).toContain(
      'className="font-display text-base text-text">{item.title}</h3>',
    );
    expect(read("src/components/sections/FeaturesGrid.tsx")).toContain(
      'className="font-display text-base text-text">{feature.title}</h3>',
    );
  });

  test("markdown paths include outline mirrors and nested group outline", () => {
    const src = read("src/lib/markdown-negotiate.ts");
    expect(src).toContain('"/outline-check"');
    expect(src).toContain("## Connect and work where you already are");
    expect(src).toContain("### Parallel development is the new normal.");
    expect(src).toContain("## Navigate schema and data");
    expect(src).toContain("### Beautiful ER diagrams without noise.");
  });
});

describe("MCP discovery", () => {
  test("/.well-known/mcp.json documents local stdio and points at server-card", () => {
    const card = JSON.parse(read("public/.well-known/mcp.json"));
    expect(card.transport.type).toBe("stdio");
    expect(card.serverCard).toBe(
      "https://www.slashtable.dev/.well-known/mcp/server-card.json",
    );
    expect(JSON.stringify(card)).not.toMatch(/"url"\s*:\s*"https:\/\/[^"]+\/mcp"/);
    expect(card.description.toLowerCase()).toContain("stdio");
    const existing = JSON.parse(read("public/.well-known/mcp/server-card.json"));
    expect(existing.transport.type).toBe("stdio");
  });
});

describe("SSR heading visibility (opacity)", () => {
  test("FadeIn stays visible until client mount (no SSR opacity:0 wrapper)", () => {
    const src = read("src/components/ui/FadeIn.tsx");
    expect(src).toContain("useMounted");
    expect(src).toMatch(/prefersReducedMotion \|\| !mounted/);
    expect(src).not.toMatch(/return \(\s*<motion\.div\s*\n\s*initial=\{\{ opacity: 0/);
  });

  test("Hero uses plain h1 and initial={false} so SSR omits opacity:0", () => {
    const src = read("src/components/sections/Hero.tsx");
    expect(src).toContain("initial={false}");
    expect(src).toMatch(/<h1 className="[^"]*text-balance/);
    expect(src).not.toMatch(/<motion\.h1/);
  });
});
