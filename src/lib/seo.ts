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

export function articleMetadata({
  title,
  description,
  path,
  publishedAt,
  updatedAt,
  tags,
  image,
  imageAlt,
  imageWidth,
  imageHeight,
}: {
  title: string;
  description: string;
  path: string;
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
}): Metadata {
  const url = canonical(path);
  const imageUrl = canonical(image);
  const images = [{ url: imageUrl, alt: imageAlt, width: imageWidth, height: imageHeight }];
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: publishedAt,
      modifiedTime: updatedAt ?? publishedAt,
      tags,
      images,
    },
    twitter: { title, description, card: "summary_large_image", images: [imageUrl] },
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
