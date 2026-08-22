import { describe, expect, test } from "bun:test";
import {
  mergeVary,
  preferredType,
  prefersMarkdown,
  markdownForPath,
  markdownNotFound,
  parseAccept,
  shouldSkipMarkdownNegotiation,
} from "../src/lib/markdown-negotiate";
import {
  formatLinkHeader,
  formatLinkRelation,
  PAGE_LINK_HEADER,
  PAGE_LINK_RELATIONS,
} from "../src/lib/link-headers";
import { problem, PROBLEM_BASE } from "../src/lib/problem";

describe("problem()", () => {
  test("builds RFC 9457 fields", () => {
    const doc = problem({
      type: `${PROBLEM_BASE}/not-found`,
      title: "Not Found",
      status: 404,
      detail: "missing",
      instance: "/api/v1/nope",
      code: "not_found",
      resolution: "check openapi",
    });
    expect(doc.status).toBe(404);
    expect(doc.type).toContain("/problems/not-found");
    expect(doc.instance).toBe("/api/v1/nope");
    expect(doc.code).toBe("not_found");
    expect(doc.resolution).toBe("check openapi");
  });

  test("omits optional fields when absent", () => {
    const doc = problem({
      type: `${PROBLEM_BASE}/x`,
      title: "X",
      status: 400,
      detail: "d",
    });
    expect(doc.instance).toBeUndefined();
    expect(doc.code).toBeUndefined();
    expect(doc.resolution).toBeUndefined();
  });
});

describe("markdown Accept negotiation", () => {
  test("browser Accept prefers html", () => {
    expect(
      preferredType(
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      ),
    ).toBe("text/html");
    expect(prefersMarkdown("text/html,application/xhtml+xml")).toBe(false);
  });

  test("Accept: text/markdown prefers markdown", () => {
    expect(preferredType("text/markdown")).toBe("text/markdown");
    expect(prefersMarkdown("text/markdown")).toBe(true);
  });

  test("q-values: higher q wins", () => {
    expect(preferredType("text/html;q=0.8, text/markdown;q=0.9")).toBe(
      "text/markdown",
    );
    expect(preferredType("text/markdown;q=0.1, text/html;q=0.9")).toBe(
      "text/html",
    );
  });

  test("explicit q=0 rejection", () => {
    expect(preferredType("text/markdown;q=0, text/html;q=1")).toBe("text/html");
    expect(preferredType("text/html;q=0, text/markdown;q=1")).toBe(
      "text/markdown",
    );
  });

  test("client order tie-break at equal q", () => {
    expect(preferredType("text/markdown, text/html")).toBe("text/markdown");
  });

  test("parseAccept reads q", () => {
    const entries = parseAccept("text/markdown;q=0.5, text/html");
    expect(entries[0]?.type).toBe("text/markdown");
    expect(entries[0]?.q).toBe(0.5);
    expect(entries[1]?.q).toBe(1);
  });

  test("mergeVary appends Accept once", () => {
    expect(mergeVary(null, "Accept")).toBe("Accept");
    expect(mergeVary("rsc", "Accept")).toBe("rsc, Accept");
    expect(mergeVary("Accept, rsc", "Accept")).toBe("Accept, rsc");
  });

  test("markdown bodies have H1 and 500+ chars", () => {
    for (const path of [
      "/",
      "/download",
      "/pricing",
      "/changelog",
      "/privacy",
      "/terms",
      "/developers",
      "/about",
      "/contact",
    ]) {
      const md = markdownForPath(path);
      expect(md).toBeTruthy();
      expect(md!.startsWith("# ")).toBe(true);
      expect(md!.length).toBeGreaterThanOrEqual(500);
    }
    expect(markdownForPath("/nope")).toBeNull();
  });
});

describe("homepage markdown structure", () => {
  test("has nested ## / ### / #### outline matching live heading buckets", () => {
    const md = markdownForPath("/")!;
    expect(md.length).toBeGreaterThanOrEqual(2000);
    expect(md).toContain("## Built for product engineers");
    expect(md).toContain("### Click through your data");
    expect(md).toContain("## Connect and work where you already are");
    expect(md).toContain("### Parallel development is the new normal.");
    expect(md).toContain("## Navigate schema and data");
    expect(md).toContain("### Bidirectional FK navigation.");
    expect(md).toContain("### Beautiful ER diagrams without noise.");
    expect(md).toContain("## Extend with plugins and agents");
    expect(md).toContain("### Bring Your Own Code.");
    expect(md).toContain("### Controlled access for AI agents.");
    expect(md).toContain("#### Battle-tested guardrails");
    expect(md).toContain("#### Schema introspection");
    expect(md).toContain("#### Per-connection access");
    expect(md).toContain("## More of the client");
    expect(md).toContain("### Everything else.");
    expect(md).toContain("## Get the app");
    expect(md).toContain("### /table.app");
    expect(md).toContain("## Community");
    expect(md).toContain("### Build with us");
    expect(md).toContain("## When to use");
    expect(md).toContain("## Developer docs");
    expect(md).toContain("## Company");
    expect(md).toContain("## Links");
    expect(md).toContain("https://www.slashtable.dev/developers/");
    expect(md).toContain("local stdio");
    expect(markdownForPath("/outline-probe")).toBeNull();
  });
});

describe("trust and developer markdown pages", () => {
  test("developers/about/contact markdown mention discovery and contact channels", () => {
    const developers = markdownForPath("/developers")!;
    expect(developers).toContain("## This page");
    expect(developers.toLowerCase()).toContain("stdio");
    expect(developers).toContain("https://www.slashtable.dev/openapi.json");

    const about = markdownForPath("/about")!;
    expect(about).toContain("Make Toast LLC");
    expect(about).toContain("## This page");

    const contact = markdownForPath("/contact")!;
    expect(contact).toContain("## This page");
    expect(contact.toLowerCase()).toContain("discord");
  });
});

describe("markdown 404 helper", () => {
  test("includes H1 Not found and discovery links", () => {
    const md = markdownNotFound("/does-not-exist");
    expect(md.startsWith("# Not found")).toBe(true);
    expect(md).toContain("`/does-not-exist`");
    expect(md).toContain("https://www.slashtable.dev/");
    expect(md).toContain("https://www.slashtable.dev/llms.txt");
    expect(md).toContain("https://www.slashtable.dev/openapi.json");
    expect(md).toContain("https://www.slashtable.dev/api/v1/product");
    expect(md).toContain("https://www.slashtable.dev/download/");
  });

  test("skips negotiation for static and api paths", () => {
    expect(shouldSkipMarkdownNegotiation("/api/v1/product")).toBe(true);
    expect(shouldSkipMarkdownNegotiation("/llms.txt")).toBe(true);
    expect(shouldSkipMarkdownNegotiation("/.well-known/api-catalog")).toBe(true);
    expect(shouldSkipMarkdownNegotiation("/favicon.png")).toBe(true);
    expect(shouldSkipMarkdownNegotiation("/nope")).toBe(false);
  });
});

describe("link headers helper", () => {
  test("PAGE_LINK_HEADER lists api-catalog and service-doc", () => {
    expect(PAGE_LINK_RELATIONS.length).toBeGreaterThanOrEqual(6);
    expect(formatLinkRelation(PAGE_LINK_RELATIONS[0]!)).toContain('rel="api-catalog"');
    expect(PAGE_LINK_HEADER).toBe(formatLinkHeader(PAGE_LINK_RELATIONS));
    expect(PAGE_LINK_HEADER).toContain('rel="service-desc"');
    expect(PAGE_LINK_HEADER).toContain('rel="status"');
  });
});


describe("openapi typed schemas", () => {
  test("product and discovery operations declare typed response schemas", async () => {
    const doc = await Bun.file(new URL("../public/openapi.json", import.meta.url)).json();
    expect(doc.openapi).toMatch(/^3\./);
    const product = doc.paths["/api/v1/product"].get;
    expect(product.responses["200"].content["application/json"].schema.$ref).toContain("ProductCard");
    expect(product.responses["200"].headers["RateLimit-Limit"]).toBeTruthy();
    expect(product.responses["200"].headers.RateLimit).toBeTruthy();
    expect(doc.components.schemas.ProductCard.properties.mcp.$ref).toContain("McpInfo");
    expect(doc.components.schemas.McpInfo.properties.transport.const).toBe("stdio");
    expect(doc.components.schemas.Platform.properties.os.enum).toContain("macos");
    expect(doc.paths["/.well-known/mcp.json"].get.operationId).toBe("getMcpDiscovery");
    expect(doc.paths["/developers"].get.operationId).toBe("getDevelopersPortal");
    expect(doc.components.schemas.OpenApiDocument.required).toContain("paths");
    expect(doc.components.schemas.ApiCatalog.required).toContain("linkset");
  });
});
