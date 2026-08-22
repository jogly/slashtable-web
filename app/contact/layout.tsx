import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact Make Toast LLC about /table via Discord or sales@slashtable.dev for team licensing questions.",
  path: "/contact/",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
