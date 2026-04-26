import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { LayoutGuides } from "@/components/ui/LayoutGuides";
import { Providers } from "./providers";
import "@/theme/base.css";

const SITE_TITLE = "/table — The database client for product engineers";
const SITE_DESCRIPTION =
  "/table is a native macOS database client for product engineers. Click through PostgreSQL and MySQL data via foreign keys, generate ER diagrams, and give AI agents safe MCP access. Buy once, yours forever.";
const OG_DESCRIPTION =
  "Navigate tables by real relationships, generate schema diagrams, provide AI agents safe read-only access via MCP, and extend everything with plugins in a native macOS app.";
const TWITTER_DESCRIPTION =
  "Navigate foreign keys by clicking, generate schema diagrams, give AI agents safe read-only access via MCP, and extend everything with plugins. macOS app for PostgreSQL and MySQL.";
const SITE_URL = "https://www.slashtable.dev";
const OG_IMAGE = "https://www.slashtable.dev/og-image.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · /table",
  },
  description: SITE_DESCRIPTION,
  applicationName: "/table",
  category: "Developer Tools",
  authors: [{ name: "Make Toast LLC", url: SITE_URL }],
  creator: "Make Toast LLC",
  publisher: "Make Toast LLC",
  keywords: [
    "database client",
    "database client for product engineers",
    "macOS database client",
    "PostgreSQL client",
    "PostgreSQL GUI",
    "MySQL client",
    "MySQL GUI",
    "SQL editor",
    "ER diagram tool",
    "schema visualization",
    "foreign key navigation",
    "MCP server",
    "MCP database",
    "AI agent database access",
    "TablePlus alternative",
    "DBeaver alternative",
    "Postico alternative",
    "/table",
    "slashtable",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  icons: { icon: "/favicon.png" },
  openGraph: {
    siteName: "/table",
    locale: "en_US",
    title: SITE_TITLE,
    description: OG_DESCRIPTION,
    type: "website",
    url: SITE_URL,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "/table app showing a data grid with foreign key navigation and schema graph — dark mode",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@slashtable",
    creator: "@slashtable",
    title: SITE_TITLE,
    description: TWITTER_DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "api-catalog": "/.well-known/api-catalog",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111114",
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}#organization`,
  name: "Make Toast LLC",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.png`,
  sameAs: ["https://x.com/slashtable", "https://discord.gg/xR2VdkfnJQ"],
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}#website`,
  url: SITE_URL,
  name: "/table",
  alternateName: "slashtable",
  description: SITE_DESCRIPTION,
  publisher: { "@id": `${SITE_URL}#organization` },
  inLanguage: "en-US",
};

const softwareApplicationLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}#software`,
  name: "/table",
  alternateName: "slashtable",
  description:
    "A native macOS database client for product engineers, with graph navigation across foreign keys, interactive ER diagramming, a built-in MCP server for AI agents, and a TypeScript plugin system. Supports PostgreSQL and MySQL.",
  applicationCategory: "DeveloperApplication",
  applicationSubCategory: "Database Client",
  operatingSystem: "macOS 12.0 or later",
  url: SITE_URL,
  downloadUrl: `${SITE_URL}/download/`,
  softwareVersion: "Stable",
  releaseNotes: `${SITE_URL}/changelog/`,
  screenshot: OG_IMAGE,
  image: OG_IMAGE,
  publisher: { "@id": `${SITE_URL}#organization` },
  offers: [
    {
      "@type": "Offer",
      name: "Free",
      price: "0",
      priceCurrency: "USD",
      url: `${SITE_URL}/download/`,
    },
    {
      "@type": "Offer",
      name: "Personal (early access)",
      price: "29",
      priceCurrency: "USD",
      url: `${SITE_URL}/pricing/`,
    },
    {
      "@type": "Offer",
      name: "Pro (early access)",
      price: "49",
      priceCurrency: "USD",
      url: `${SITE_URL}/pricing/`,
    },
  ],
  featureList: [
    "Foreign-key graph navigation",
    "Interactive ER diagrams",
    "Built-in MCP server for AI agents",
    "Read-only enforcement with rolled-back transactions",
    "TypeScript plugin system",
    "SQL editor with schema-aware autocomplete",
    "Multiple simultaneous connections",
    "Virtual scrolling for millions of rows",
    "Docker auto-detection",
    "Credential vault integrations (Keychain, 1Password, AWS Secrets Manager, HashiCorp Vault)",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://downloads.slashtable.dev" />
        <link rel="preconnect" href="https://tr.slashtable.dev" />
        <link rel="service-doc" href="https://docs.slashtable.dev" />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted server-side JSON
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted server-side JSON
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted server-side JSON
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationLd) }}
        />
      </head>
      <body>
        <Providers>
          <LayoutGuides />
          <Nav />
          <main>{children}</main>
          <Footer />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
