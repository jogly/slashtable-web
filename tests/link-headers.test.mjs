import assert from "node:assert/strict";
import test from "node:test";

/**
 * Mirror of src/lib/link-headers.ts (pure string helper) so node:test
 * can assert without a TS loader.
 */
function formatLinkRelation(link) {
  let value = `<${link.href}>; rel="${link.rel}"`;
  if (link.type) value += `; type="${link.type}"`;
  return value;
}

function formatLinkHeader(links) {
  return links.map(formatLinkRelation).join(", ");
}

const PAGE_LINK_RELATIONS = [
  { href: "/.well-known/api-catalog", rel: "api-catalog" },
  {
    href: "/openapi.json",
    rel: "service-desc",
    type: "application/openapi+json",
  },
  {
    href: "/openapi.json",
    rel: "service-doc",
    type: "application/openapi+json",
  },
  { href: "/llms.txt", rel: "service-doc", type: "text/markdown" },
  { href: "/", rel: "alternate", type: "text/markdown" },
  { href: "/api/v1/product", rel: "status", type: "application/json" },
];

test("formatLinkRelation includes type when present", () => {
  assert.equal(
    formatLinkRelation({
      href: "/openapi.json",
      rel: "service-desc",
      type: "application/openapi+json",
    }),
    '</openapi.json>; rel="service-desc"; type="application/openapi+json"',
  );
});

test("formatLinkRelation omits type when absent", () => {
  assert.equal(
    formatLinkRelation({ href: "/.well-known/api-catalog", rel: "api-catalog" }),
    '</.well-known/api-catalog>; rel="api-catalog"',
  );
});

test("PAGE_LINK_HEADER is comma-separated RFC 8288 links", () => {
  const header = formatLinkHeader(PAGE_LINK_RELATIONS);
  assert.match(header, /<\/\.well-known\/api-catalog>; rel="api-catalog"/);
  assert.match(
    header,
    /<\/openapi\.json>; rel="service-desc"; type="application\/openapi\+json"/,
  );
  assert.match(
    header,
    /<\/openapi\.json>; rel="service-doc"; type="application\/openapi\+json"/,
  );
  assert.match(
    header,
    /<\/llms\.txt>; rel="service-doc"; type="text\/markdown"/,
  );
  assert.match(header, /<\/>; rel="alternate"; type="text\/markdown"/);
  assert.match(
    header,
    /<\/api\/v1\/product>; rel="status"; type="application\/json"/,
  );
  assert.equal(header.split(", ").length, PAGE_LINK_RELATIONS.length);
});
