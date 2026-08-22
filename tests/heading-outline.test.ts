import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");

function read(rel: string) {
  return readFileSync(join(root, rel), "utf8");
}

describe("homepage heading outline (source)", () => {
  test("page wires nested group h2 buckets for Ora", () => {
    const src = read("app/page.tsx");
    expect(src).toContain('groupHeading="Connect and work where you already are"');
    expect(src).toContain('groupHeading="Navigate schema and data"');
    expect(src).toContain('groupHeading="Extend with plugins and agents"');
    expect(src).toContain('groupHeading="Get the app"');
    expect(src).toContain('groupHeading="Community"');
  });

  test("ValuePillars keeps visible structural h2; pillar h3s are not inside <a>", () => {
    const src = read("src/components/sections/ValuePillars.tsx");
    expect(src).toMatch(/<h2[^>]*id="value-pillars-heading"/);
    expect(src).not.toMatch(/sr-only/);
    expect(src).toMatch(/<h3[\s>]/);
    expect(src).not.toMatch(/<a[\s\S]*?<h3/);
  });

  test("lead sections expose mono group h2 and demote feature titles to h3", () => {
    for (const rel of [
      "src/components/sections/ConnectSection.tsx",
      "src/components/sections/NavigationSection.tsx",
      "src/components/sections/PluginSection.tsx",
    ]) {
      const src = read(rel);
      expect(src).toContain("groupHeading");
      expect(src).toMatch(/<h2[\s\n]*id=\{groupHeadingId\}/);
      expect(src).toMatch(/<h3 className="[^"]*font-display text-3xl/);
      expect(src).not.toMatch(/<h2 className="[^"]*font-display text-3xl/);
    }
  });

  test("Schema/MCP/Features demote large titles to h3 under Extend/Navigate groups", () => {
    for (const rel of [
      "src/components/sections/SchemaGraphSection.tsx",
      "src/components/sections/McpSection.tsx",
      "src/components/sections/FeaturesGrid.tsx",
    ]) {
      const src = read(rel);
      expect(src).toMatch(/<h3 className="[^"]*font-display text-3xl/);
      expect(src).not.toMatch(/<h2 className="[^"]*font-display text-3xl/);
    }
  });

  test("DownloadSection demotes /table.app title to h3 under Get the app h2", () => {
    const src = read("src/components/sections/DownloadSection.tsx");
    expect(src).toContain("groupHeading");
    expect(src).toMatch(/<h3 className="font-display text-3xl text-text lg:text-5xl">/);
    expect(src).not.toMatch(/<h2 className="font-display text-3xl text-text lg:text-5xl">/);
  });

  test("CommunitySection demotes Build with us to h3; SectionHeading uses h3", () => {
    const community = read("src/components/sections/CommunitySection.tsx");
    expect(community).toContain("groupHeading");
    expect(community).not.toMatch(/<a[\s\S]*?<h3/);
    const heading = read("src/components/ui/SectionHeading.tsx");
    expect(heading).toMatch(/<h3[^>]*className="font-display/);
    expect(heading).not.toMatch(/<h2[^>]*className="font-display/);
  });

  test("Connect/Features/MCP promote subsection titles to h3", () => {
    const connect = read("src/components/sections/ConnectSection.tsx");
    expect(connect).toContain('className="font-display text-sm text-text">{item.title}</h3>');
    const features = read("src/components/sections/FeaturesGrid.tsx");
    expect(features).toContain('className="font-display text-sm text-text">{feature.title}</h3>');
    const mcp = read("src/components/sections/McpSection.tsx");
    expect(mcp).toMatch(/<h3\s+className="font-display text-sm transition-colors"/);
  });

  test("Accept-markdown homepage mirrors nested group outline", () => {
    const src = read("src/lib/markdown-negotiate.ts");
    expect(src).toContain("## Connect and work where you already are");
    expect(src).toContain("### Parallel development is the new normal.");
    expect(src).toContain("## Navigate schema and data");
    expect(src).toContain("### Bidirectional FK navigation.");
    expect(src).toContain("### Beautiful ER diagrams without noise.");
    expect(src).toContain("## Extend with plugins and agents");
    expect(src).toContain("### Bring Your Own Code.");
    expect(src).toContain("### Controlled access for AI agents.");
    expect(src).toContain("### Everything else.");
    expect(src).toContain("## Get the app");
    expect(src).toContain("### /table.app");
    expect(src).toContain("## Community");
    expect(src).toContain("### Build with us");
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
