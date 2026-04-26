import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How /table collects, uses, and protects your data.",
  path: "/privacy/",
});

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
