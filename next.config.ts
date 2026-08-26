import type { NextConfig } from "next";
import {
  CATALOG_LINK_HEADER,
  PAGE_LINK_HEADER,
} from "./src/lib/link-headers";

const pageSources = [
  "/",
  "/download",
  "/download/",
  "/pricing",
  "/pricing/",
  "/changelog",
  "/changelog/",
  "/privacy",
  "/privacy/",
  "/terms",
  "/terms/",
  "/developers",
  "/developers/",
  "/about",
  "/about/",
  "/contact",
  "/contact/",
  "/blog",
  "/blog/",
  "/blog/:slug",
  "/blog/:slug/",
];

const config: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      ...pageSources.map((source) => ({
        source,
        headers: [{ key: "Link", value: PAGE_LINK_HEADER }],
      })),
      {
        source: "/install.sh",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          { key: "Cache-Control", value: "public, max-age=300" },
        ],
      },
      {
        source: "/llms.txt",
        headers: [
          { key: "Content-Type", value: "text/markdown; charset=utf-8" },
          { key: "Cache-Control", value: "public, max-age=300" },
          { key: "Link", value: CATALOG_LINK_HEADER },
        ],
      },
      {
        source: "/openapi.json",
        headers: [
          { key: "Content-Type", value: "application/json; charset=utf-8" },
          { key: "Cache-Control", value: "public, max-age=300" },
          { key: "Link", value: CATALOG_LINK_HEADER },
        ],
      },
    ];
  },
};

export default config;
