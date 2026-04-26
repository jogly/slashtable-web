import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { LayoutGuides } from "@/components/ui/LayoutGuides";
import { Providers } from "./providers";
import "@/theme/base.css";

const SITE_TITLE = "/table — The database client for product engineers";
const SITE_DESCRIPTION =
  "A native macOS database client with graph navigation, interactive ER diagramming, a built-in MCP server for AI agents, and a plugin system. PostgreSQL and MySQL.";
const OG_DESCRIPTION =
  "Navigate tables by real relationships, generate schema diagrams, provide AI agents safe read-only access via MCP, and extend everything with plugins in a native macOS app.";
const TWITTER_DESCRIPTION =
  "Navigate foreign keys by clicking, generate schema diagrams, give AI agents safe read-only access via MCP, and extend everything with plugins. macOS app for PostgreSQL and MySQL.";
const SITE_URL = "https://www.slashtable.dev";
const OG_IMAGE = "https://www.slashtable.dev/og-image.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
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
    title: SITE_TITLE,
    description: TWITTER_DESCRIPTION,
    images: [OG_IMAGE],
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://downloads.slashtable.dev" />
        <link rel="preconnect" href="https://tr.slashtable.dev" />
        <link rel="service-doc" href="https://docs.slashtable.dev" />
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
