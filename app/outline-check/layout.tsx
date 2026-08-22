import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Outline check",
  description: "SSR homepage outline mirror for agent content extractors.",
  path: "/outline-check/",
  robots: { index: false, follow: true },
});

export default function OutlineCheckLayout({ children }: { children: React.ReactNode }) {
  return children;
}
