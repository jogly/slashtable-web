/** RFC 9457 Problem Details helpers (application/problem+json). */

export type ProblemInput = {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  code?: string;
  resolution?: string;
};

export type ProblemDocument = {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  code?: string;
  resolution?: string;
};

export const PROBLEM_BASE = "https://www.slashtable.dev/problems";

export function problem(input: ProblemInput): ProblemDocument {
  const doc: ProblemDocument = {
    type: input.type,
    title: input.title,
    status: input.status,
    detail: input.detail,
  };
  if (input.instance !== undefined) doc.instance = input.instance;
  if (input.code !== undefined) doc.code = input.code;
  if (input.resolution !== undefined) doc.resolution = input.resolution;
  return doc;
}

export function problemJson(
  input: ProblemInput,
  init?: { headers?: HeadersInit },
): Response {
  const body = problem(input);
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/problem+json; charset=utf-8");
  headers.set("Cache-Control", "no-store");
  return new Response(JSON.stringify(body), {
    status: input.status,
    headers,
  });
}

export function notFoundProblem(instance: string, detail?: string): Response {
  return problemJson({
    type: `${PROBLEM_BASE}/not-found`,
    title: "Not Found",
    status: 404,
    detail:
      detail ??
      `No public HTTP resource exists at ${instance}. See /openapi.json for documented endpoints.`,
    instance,
    code: "not_found",
    resolution:
      "Use a documented path from https://www.slashtable.dev/openapi.json (for example GET /api/v1/product).",
  });
}

export function methodNotAllowedProblem(
  instance: string,
  allow: string[],
): Response {
  return problemJson(
    {
      type: `${PROBLEM_BASE}/method-not-allowed`,
      title: "Method Not Allowed",
      status: 405,
      detail: `This resource does not support the requested HTTP method. Allowed: ${allow.join(", ")}.`,
      instance,
      code: "method_not_allowed",
      resolution: `Retry with one of: ${allow.join(", ")}.`,
    },
    { headers: { Allow: allow.join(", ") } },
  );
}
