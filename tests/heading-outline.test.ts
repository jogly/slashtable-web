import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");

function read(rel: string) {
  return readFileSync(join(root, rel), "utf8");
}

describe("homepage heading outline (source)", () => {
  test("FeaturesGrid keeps section h2 and demotes feature titles off heading outline", () => {
    const src = read("src/components/sections/FeaturesGrid.tsx");
    expect(src).toContain("<h2");
    expect(src).not.toMatch(/<h3[\s>]/);
    expect(src).toContain('className="font-display text-sm text-text">{feature.title}</p>');
  });

  test("ConnectSection demotes card titles off heading outline", () => {
    const src = read("src/components/sections/ConnectSection.tsx");
    expect(src).toContain("<h2");
    expect(src).not.toMatch(/<h3[\s>]/);
  });

  test("ValuePillars keeps structural h2 with pillar h3 children", () => {
    const src = read("src/components/sections/ValuePillars.tsx");
    expect(src).toMatch(/<h2[^>]*id="value-pillars-heading"/);
    expect(src).toMatch(/<h3[\s>]/);
  });

  test("McpSection keeps one h2 and demotes callout titles", () => {
    const src = read("src/components/sections/McpSection.tsx");
    expect(src.match(/<h2[\s>]/g)?.length ?? 0).toBe(1);
    expect(src).not.toMatch(/<h3[\s>]/);
  });

  test("CommunitySection demotes link card titles", () => {
    const src = read("src/components/sections/CommunitySection.tsx");
    expect(src).not.toMatch(/<h3[\s>]/);
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
