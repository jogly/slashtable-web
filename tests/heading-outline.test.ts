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
  test("FadeIn stays visible on first paint (no remount to opacity:0)", () => {
    const src = read("src/components/ui/FadeIn.tsx");
    expect(src).toContain("initial={false}");
    expect(src).not.toContain("useMounted");
    expect(src).not.toMatch(/initial=\{\{\s*opacity:\s*0/);
    expect(src).toContain("if (prefersReducedMotion)");
    expect(src).toContain("return <div className={className}>{children}</div>");
  });

  test("Hero uses plain h1 and initial={false} so SSR omits opacity:0", () => {
    const src = read("src/components/sections/Hero.tsx");
    expect(src).toContain("initial={false}");
    expect(src).toMatch(/<h1 className="[^"]*text-balance/);
    expect(src).not.toMatch(/<motion\.h1/);
    expect(src).not.toContain('introControls.set("hidden")');
    expect(src).not.toContain("useLayoutEffect");
  });
});

describe("first-paint theme / font / sky", () => {
  test("blocking script sets data-theme and useTheme does not wait on useMounted", () => {
    const script = read("src/lib/theme-script.ts");
    expect(script).toContain('export const THEME_STORAGE_KEY = "st-theme"');
    expect(script).toContain("data-theme");
    expect(script).toContain("prefers-color-scheme");
    const layout = read("app/layout.tsx");
    expect(layout).toContain("THEME_BOOTSTRAP_SCRIPT");
    expect(layout).toContain('data-theme="dark"');
    const provider = read("src/components/providers/ThemeProvider.tsx");
    expect(provider).toContain("disableTransitionOnChange");
    expect(provider).toContain("themeFromDocument");
    expect(provider).not.toContain("useMounted");
  });

  test("webfonts use real optional faces, not empty @font-face overrides", () => {
    const css = read("src/theme/base.css");
    expect(css).not.toContain("@fontsource-variable");
    expect(css).not.toMatch(/@font-face\s*\{[^}]*font-display:\s*optional/);
    expect(css).not.toMatch(/transition:\s*background-color 0\.3s ease/);
    const fonts = read("src/lib/fonts.ts");
    expect(fonts).toContain('display: "optional"');
    expect(fonts).toContain("manrope-latin-wght-normal.woff2");
    expect(fonts).toContain("playfair-display-latin-wght-italic.woff2");
    expect(fonts).toContain("source-serif-4-latin-wght-normal.woff2");
    expect(fonts).toContain('variable: "--font-source-serif"');
  });

  test("sky is a CSS background with head preloads, not a late img", () => {
    const sky = read("src/components/ui/SkyParallax.tsx");
    expect(sky).toContain("sky-layer");
    expect(sky).not.toMatch(/<img[\s>/]/);
    expect(sky).not.toContain("from \"./Img\"");
    expect(sky).not.toContain("useTheme");
    const css = read("src/theme/base.css");
    expect(css).toContain("background-image: var(--sky-image, var(--sky-night))");
    expect(css).toContain("html[data-theme=\"light\"]");
    expect(css).toContain("--sky-image: var(--sky-day)");
    const layout = read("app/layout.tsx");
    expect(layout).toContain('rel="preload"');
    expect(layout).toContain("SKY_NIGHT_SRC");
    expect(layout).toContain("SKY_DAY_SRC");
    const assets = read("src/lib/sky.ts");
    expect(assets).toContain("sky-night.webp");
    expect(assets).toContain("sky-day.webp");
  });

  test("Hero availability is a static Linux-inclusive string", () => {
    const hero = read("src/components/sections/Hero.tsx");
    expect(hero).toContain("{HERO.availability}");
    expect(hero).toContain("{HERO.ctaDownload}");
    expect(hero).not.toContain("useDownload");
    expect(hero).not.toContain("linuxAvailable");
    expect(hero).not.toContain("ctaDownloadLinux");
    const copy = read("src/lib/copy.ts");
    expect(copy).toContain("Linux (alpha)");
    expect(copy).toContain('availability: "macOS \\u00b7 Linux (alpha)');
  });
});
