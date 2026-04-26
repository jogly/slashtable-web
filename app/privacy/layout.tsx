import type { Metadata } from "next";

const SITE_URL = "https://www.slashtable.dev";
const PAGE_URL = `${SITE_URL}/privacy/`;
const TITLE = "Privacy Policy";
const DESCRIPTION = "How /table collects, uses, and protects your data.";

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

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
