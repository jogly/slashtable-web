import type { MetadataRoute } from "next";
import { canonical } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: canonical("/"), lastModified, changeFrequency: "daily", priority: 1.0 },
    { url: canonical("/download/"), lastModified, changeFrequency: "daily", priority: 0.9 },
    { url: canonical("/pricing/"), lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: canonical("/changelog/"), lastModified, changeFrequency: "daily", priority: 0.7 },
    { url: canonical("/upgrade/"), lastModified, changeFrequency: "monthly", priority: 0.4 },
    { url: canonical("/privacy/"), lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: canonical("/terms/"), lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
