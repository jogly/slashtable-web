import type { Metadata } from "next";

const SITE_URL = "https://www.slashtable.dev";
const PAGE_URL = `${SITE_URL}/terms/`;
const TITLE = "Terms of Service";
const DESCRIPTION = "Terms of service for /table.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: `${TITLE} · /table`,
    description: DESCRIPTION,
    url: PAGE_URL,
    type: "article",
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
