import type { Metadata } from "next";
import { SITE_URL } from "./constants";

export function canonical(path: string): string {
  return `${SITE_URL}${path}`;
}

export function pageMetadata({
  title,
  description,
  path,
  robots,
}: {
  title: string;
  description?: string;
  path: string;
  robots?: Metadata["robots"];
}): Metadata {
  const url = canonical(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
    twitter: { title, description },
    ...(robots !== undefined && { robots }),
  };
}

export function breadcrumb(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: canonical(item.path),
    })),
  };
}
