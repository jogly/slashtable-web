import type { Metadata } from "next";

const SITE_URL = "https://www.slashtable.dev";
const PAGE_URL = `${SITE_URL}/download/`;
const TITLE = "Download /table for macOS — PostgreSQL & MySQL database client";
const DESCRIPTION =
  "Download /table — the native macOS database client for product engineers. Apple Silicon and Intel builds. Free tier available, no signup required. PostgreSQL and MySQL.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: `${TITLE} · /table`,
    description: DESCRIPTION,
    url: PAGE_URL,
    type: "website",
  },
  twitter: {
    title: `${TITLE} · /table`,
    description: DESCRIPTION,
  },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Download", item: PAGE_URL },
  ],
};

const downloadLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "/table",
  alternateName: "slashtable",
  applicationCategory: "DeveloperApplication",
  applicationSubCategory: "Database Client",
  operatingSystem: "macOS 12.0 or later",
  processorRequirements: "Apple Silicon (aarch64) or Intel (x86_64)",
  fileSize: "~40 MB",
  url: PAGE_URL,
  downloadUrl: PAGE_URL,
  installUrl: PAGE_URL,
  softwareRequirements: "PostgreSQL 12+ or MySQL 8.0+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
};

export default function DownloadLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted server-side JSON
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted server-side JSON
        dangerouslySetInnerHTML={{ __html: JSON.stringify(downloadLd) }}
      />
      {children}
    </>
  );
}
