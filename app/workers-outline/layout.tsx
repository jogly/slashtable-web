import type { Metadata } from "next";

const WORKERS_ORIGIN = "https://slashtable-web.make-toast.workers.dev";

export const metadata: Metadata = {
  title: "Workers outline",
  description: "Nested heading probe hosted for workers.dev Ora scans.",
  alternates: { canonical: `${WORKERS_ORIGIN}/workers-outline/` },
  openGraph: {
    title: "Workers outline",
    url: `${WORKERS_ORIGIN}/workers-outline/`,
    type: "website",
  },
  robots: { index: false, follow: true },
};

export default function WorkersOutlineLayout({ children }: { children: React.ReactNode }) {
  return children;
}
