import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Nest outline",
  description:
    "SSR homepage outline mirror for agent content extractors. Same nested heading structure as the homepage.",
  path: "/nest-outline/",
  robots: { index: false, follow: true },
});

export default function NestOutlineLayout({ children }: { children: React.ReactNode }) {
  return children;
}
