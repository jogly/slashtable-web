import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Developers",
  description:
    "Developer portal for /table: OpenAPI, llms.txt, product card API, local MCP server card, and install links. MCP is local stdio inside the desktop app.",
  path: "/developers/",
});

export default function DevelopersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
