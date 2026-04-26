import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of Service",
  description: "Terms of service for /table.",
  path: "/terms/",
});

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
