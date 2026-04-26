import { JsonLd } from "@/components/seo/JsonLd";
import { PRICING } from "@/lib/copy";
import { breadcrumb, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Pricing — Database client for product engineers",
  description:
    "Buy /table once, yours forever. Free for one connection, Personal for $29 (early access), Pro for $49, and Team plans per seat. macOS database client for PostgreSQL and MySQL.",
  path: "/pricing/",
});

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PRICING.faq.items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={faqLd} />
      <JsonLd data={breadcrumb([{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing/" }])} />
      {children}
    </>
  );
}
