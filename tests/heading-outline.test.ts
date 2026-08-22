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

  test("ValuePillars keeps visible structural h2 with pillar h3 children", () => {
    const src = read("src/components/sections/ValuePillars.tsx");
    expect(src).toMatch(/<h2[^>]*id="value-pillars-heading"/);
    expect(src).not.toMatch(/sr-only/);
    expect(src).toMatch(/<h3[\s>]/);
  });

  test("feature sections demote big titles to h3 under group h2", () => {
    for (const rel of [
      "src/components/sections/ConnectSection.tsx",
      "src/components/sections/NavigationSection.tsx",
      "src/components/sections/SchemaGraphSection.tsx",
      "src/components/sections/PluginSection.tsx",
      "src/components/sections/McpSection.tsx",
      "src/components/sections/FeaturesGrid.tsx",
    ]) {
      const src = read(rel);
      // Section title uses h3 (font-display large), not h2 — except lead sections may have group h2
      expect(src).toMatch(/<h3 className="[^"]*font-display/);
      // No leftover peer section-title h2 with font-display 3xl/4xl
      expect(src).not.toMatch(/<h2 className="[^"]*font-display text-3xl/);
    }
  });

  test("Connect/Navigation/Plugin lead sections expose group h2", () => {
    for (const rel of [
      "src/components/sections/ConnectSection.tsx",
      "src/components/sections/NavigationSection.tsx",
      "src/components/sections/PluginSection.tsx",
    ]) {
      const src = read(rel);
      expect(src).toContain("groupHeading");
      expect(src).toMatch(/<h2[\s\n]/id=\{groupHeadingId\}/);
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
    expect(community).not.toMatch(/eyebrow=\{COMMUNITY\.eyebrow\}/);
    const heading = read("src/components/ui/SectionHeading.tsx");
    expect(heading).toMatch(/<h3 className="font-display/);
    expect(heading).not.toMatch(/<h2 className="font-display/);
  });

  test("FeaturesGrid keeps feature titles off heading outline", () => {
    const src = read("src/components/sections/FeaturesGrid.tsx");
    expect(src).toContain('className="font-display text-sm text-text">{feature.title}</p>');
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
