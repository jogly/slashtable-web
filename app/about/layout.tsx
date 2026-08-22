import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About",
  description:
    "About Make Toast LLC and /table, the local desktop database client for product engineers with built-in MCP over stdio.",
  path: "/about/",
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
