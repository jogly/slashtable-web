import type { Metadata } from "next";

const SITE_URL = "https://www.slashtable.dev";
const PAGE_URL = `${SITE_URL}/upgrade/`;
const TITLE = "Upgrade to Pro";
const DESCRIPTION = "Upgrade your /table Personal license to Pro by paying the difference.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  robots: { index: false, follow: true },
};

export default function UpgradeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
