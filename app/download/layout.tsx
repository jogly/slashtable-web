import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumb, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Download /table for macOS — PostgreSQL & MySQL database client",
  description:
    "Download /table — the native macOS database client for product engineers. Apple Silicon and Intel builds. Free tier available, no signup required. PostgreSQL and MySQL.",
  path: "/download/",
});

export default function DownloadLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumb([{ name: "Home", path: "/" }, { name: "Download", path: "/download/" }])} />
      {children}
    </>
  );
}
