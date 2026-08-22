import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Outline probe",
  description: "Minimal nested heading probe page for agent content extractors.",
  path: "/outline-probe/",
  robots: { index: false, follow: true },
});

export default function OutlineProbeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
