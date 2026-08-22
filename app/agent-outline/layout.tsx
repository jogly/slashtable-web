import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Agent outline",
  description:
    "SSR homepage outline mirror for agent content extractors. Same nested heading structure as the homepage.",
  path: "/agent-outline/",
  robots: { index: false, follow: true },
});

export default function AgentOutlineLayout({ children }: { children: React.ReactNode }) {
  return children;
}
