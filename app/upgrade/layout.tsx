import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Upgrade to Pro",
  description: "Upgrade your /table Personal license to Pro by paying the difference.",
  path: "/upgrade/",
  robots: { index: false, follow: true },
});

export default function UpgradeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
