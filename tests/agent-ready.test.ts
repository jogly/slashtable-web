import { describe, expect, test } from "bun:test";
import {
  mergeVary,
  preferredType,
  prefersMarkdown,
  markdownForPath,
  parseAccept,
} from "../src/lib/markdown-negotiate";
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
    for (const path of ["/", "/download", "/pricing", "/changelog", "/privacy", "/terms"]) {
      const md = markdownForPath(path);
      expect(md).toBeTruthy();
      expect(md!.startsWith("# ")).toBe(true);
      expect(md!.length).toBeGreaterThanOrEqual(500);
    }
    expect(markdownForPath("/nope")).toBeNull();
  });
});
