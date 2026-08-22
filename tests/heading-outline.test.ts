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
    expect(src).toContain('<h3 className="mb-3 font-display text-xl text-text lg:text-2xl">{pillar.title}</h3>');
    // Icon link closes before the pillar h3; learn-more link follows it.
    const h3At = src.indexOf('<h3 className="mb-3 font-display text-xl');
    const firstAClose = src.indexOf("</a>");
    const learnMore = src.indexOf("Learn more");
    expect(h3At).toBeGreaterThan(firstAClose);
    expect(learnMore).toBeGreaterThan(h3At);
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

  test("item labels are non-heading text-base so outline stays nested not flat", () => {
    expect(read("src/components/sections/ConnectSection.tsx")).toContain(
      'className="font-display text-base text-text">{item.title}</p>',
    );
    expect(read("src/components/sections/FeaturesGrid.tsx")).toContain(
      'className="font-display text-base text-text">{feature.title}</p>',
    );
  });

  test("MCP callouts nest as h4 under the feature h3", () => {
    const src = read("src/components/sections/McpSection.tsx");
    expect(src).toMatch(/<h4\s*\n\s*className="font-display text-xl transition-colors"/);
    expect(src).not.toMatch(/<h3\s*\n\s*className="font-display text-base transition-colors"/);
  });

  test("markdown homepage has nested group outline with h4 depth", () => {
    const src = read("src/lib/markdown-negotiate.ts");
    expect(src).not.toContain('"/outline-check"');
    expect(src).not.toContain('"/outline-probe"');
    expect(src).toContain("## Connect and work where you already are");
    expect(src).toContain("### Parallel development is the new normal.");
    expect(src).toContain("## Navigate schema and data");
    expect(src).toContain("### Beautiful ER diagrams without noise.");
    expect(src).toContain("#### Battle-tested guardrails");
    expect(src).toContain("## More of the client");
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
    expect(src).toContain("if (prefersReducedMotion || !mounted)");
    expect(src).toContain("return <div className={className}>{children}</div>");
  });

  test("Hero uses plain h1 and initial={false} so SSR omits opacity:0", () => {
    const src = read("src/components/sections/Hero.tsx");
    expect(src).toContain("initial={false}");
    expect(src).toMatch(/<h1 className="[^"]*text-balance/);
    expect(src).not.toMatch(/<motion\.h1/);
  });
});
