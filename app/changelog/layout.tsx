import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumb, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Changelog — What's new in /table",
  description:
    "Release notes for /table, the macOS database client for product engineers. New features, bug fixes, and improvements shipping daily.",
  path: "/changelog/",
});

export default function ChangelogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumb([{ name: "Home", path: "/" }, { name: "Changelog", path: "/changelog/" }])} />
      {children}
    </>
  );
}
