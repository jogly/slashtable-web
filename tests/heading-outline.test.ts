import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");

function read(rel: string) {
  return readFileSync(join(root, rel), "utf8");
}

describe("homepage heading outline (source)", () => {
  test("ValuePillars keeps visible structural h2; pillar h3s are not inside <a>", () => {
    const src = read("src/components/sections/ValuePillars.tsx");
    expect(src).toMatch(/<h2[^>]*id="value-pillars-heading"/);
    expect(src).not.toMatch(/sr-only/);
    expect(src).toMatch(/<h3[\s>]/);
    // Headings must not be descendants of wrapping card anchors
    expect(src).not.toMatch(/<a[\s\S]*?<h3/);
    expect(src).toContain("Learn more");
  });

  test("feature section titles stay major h2 (font-display 3xl/4xl/5xl)", () => {
    for (const rel of [
      "src/components/sections/ConnectSection.tsx",
      "src/components/sections/NavigationSection.tsx",
      "src/components/sections/SchemaGraphSection.tsx",
      "src/components/sections/PluginSection.tsx",
      "src/components/sections/McpSection.tsx",
      "src/components/sections/FeaturesGrid.tsx",
    ]) {
      const src = read(rel);
      expect(src).toMatch(/<h2[^>]*className="[^"]*font-display text-3xl/);
    }
    const download = read("src/components/sections/DownloadSection.tsx");
    expect(download).toMatch(/<h2[^>]*className="font-display text-3xl text-text lg:text-5xl"/);
  });

  test("Connect/Features/MCP/Community promote subsection titles to h3", () => {
    const connect = read("src/components/sections/ConnectSection.tsx");
    expect(connect).toContain('className="font-display text-sm text-text">{item.title}</h3>');
    expect(connect).not.toContain('className="font-display text-sm text-text">{item.title}</p>');

    const features = read("src/components/sections/FeaturesGrid.tsx");
    expect(features).toContain('className="font-display text-sm text-text">{feature.title}</h3>');
    expect(features).not.toContain('className="font-display text-sm text-text">{feature.title}</p>');

    const mcp = read("src/components/sections/McpSection.tsx");
    expect(mcp).toMatch(/<h3\s+className="font-display text-sm transition-colors"/);
    expect(mcp).not.toMatch(/<p\s+className="font-display text-sm transition-colors"/);

    const community = read("src/components/sections/CommunitySection.tsx");
    expect(community).toContain('className="font-display text-base text-text">{link.title}</h3>');
    expect(community).not.toMatch(/<a[\s\S]*?<h3/);
  });

  test("Accept-markdown homepage mirrors nested feature h2 then subsection h3", () => {
    const src = read("src/lib/markdown-negotiate.ts");
    expect(src).toContain("## Built for product engineers");
    expect(src).toContain("### Click through your data");
    expect(src).toContain("## Parallel development is the new normal.");
    expect(src).toContain("### Docker auto-detect");
    expect(src).toContain("## Bidirectional FK navigation.");
    expect(src).toContain("## Beautiful ER diagrams without noise.");
    expect(src).toContain("## Bring Your Own Code.");
    expect(src).toContain("## Controlled access for AI agents.");
    expect(src).toContain("### Battle-tested guardrails");
    expect(src).toContain("## Everything else.");
    expect(src).toContain("### SQL editor");
    expect(src).toContain("## /table.app");
    expect(src).toContain("## Build with us");
    expect(src).toContain("### Discord");
    expect(src).not.toContain("## Connect and work where you already are");
    expect(src).not.toContain("## Navigate schema and data");
    expect(src).not.toContain("## Extend with plugins and agents");
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
    const existing = JSON.parse(
      read("public/.well-known/mcp/server-card.json"),
    );
    expect(existing.transport.type).toBe("stdio");
  });
});

describe("SSR heading visibility (opacity)", () => {
  test("FadeIn stays visible until client mount (no SSR opacity:0 wrapper)", () => {
    const src = read("src/components/ui/FadeIn.tsx");
    expect(src).toContain("useMounted");
    expect(src).toMatch(/prefersReducedMotion \|\| !mounted/);
    // Must not unconditionally SSR initial opacity 0
    expect(src).not.toMatch(/return \(\s*<motion\.div\s*\n\s*initial=\{\{ opacity: 0/);
  });

  test("Hero uses plain h1 and initial={false} so SSR omits opacity:0", () => {
    const src = read("src/components/sections/Hero.tsx");
    expect(src).toContain("initial={false}");
    expect(src).toContain("useAnimationControls");
    expect(src).toMatch(/<h1 className="[^"]*text-balance/);
    expect(src).not.toMatch(/<motion\.h1/);
    expect(src).not.toMatch(/initial=\{prefersReducedMotion \? undefined : "hidden"\}/);
  });
});
