import type { Metadata } from "next";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "www.slashtable.dev";
  const proto = h.get("x-forwarded-proto") || "https";
  const origin = `${proto}://${host}`;
  const url = `${origin}/outline-probe/`;
  return {
    title: "Outline probe",
    description: "Minimal nested heading probe page for agent content extractors.",
    alternates: { canonical: url },
    openGraph: { title: "Outline probe", url, type: "website" },
    robots: { index: false, follow: true },
  };
}

export default function OutlineProbeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
