import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Agent readiness",
  description:
    "SSR homepage outline mirror for agent content extractors. Same nested heading structure as the homepage.",
  path: "/agent-readiness/",
  robots: { index: false, follow: true },
});

export default function AgentReadinessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
