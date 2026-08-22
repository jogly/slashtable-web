/** RFC 8288 Link header builders for agent discovery. */

export type LinkRelation = {
  href: string;
  rel: string;
  type?: string;
};

/** Format one Link value: </path>; rel="…"; type="…" */
export function formatLinkRelation(link: LinkRelation): string {
  let value = `<${link.href}>; rel="${link.rel}"`;
  if (link.type) {
    value += `; type="${link.type}"`;
  }
  return value;
}

/** Comma-separate multiple Link relations into one header value. */
export function formatLinkHeader(links: readonly LinkRelation[]): string {
  return links.map(formatLinkRelation).join(", ");
}

/** Homepage / marketing-page discovery links (RFC 8288). */
export const PAGE_LINK_RELATIONS: readonly LinkRelation[] = [
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
] as const;

export const PAGE_LINK_HEADER = formatLinkHeader(PAGE_LINK_RELATIONS);

/** Catalog pointer for static agent docs (/llms.txt, /openapi.json). */
export const CATALOG_LINK_RELATIONS: readonly LinkRelation[] = [
  { href: "/.well-known/api-catalog", rel: "api-catalog" },
] as const;

export const CATALOG_LINK_HEADER = formatLinkHeader(CATALOG_LINK_RELATIONS);

/** Links on /api/v1/product JSON responses. */
export const PRODUCT_LINK_RELATIONS: readonly LinkRelation[] = [
  {
    href: "/openapi.json",
    rel: "service-desc",
    type: "application/openapi+json",
  },
  { href: "/.well-known/api-catalog", rel: "api-catalog" },
] as const;

export const PRODUCT_LINK_HEADER = formatLinkHeader(PRODUCT_LINK_RELATIONS);
