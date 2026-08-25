import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// package.json "build" is `opennextjs-cloudflare build` so Workers preview
// (`bun run build`) emits `.open-next/worker.js`. OpenNext would otherwise
// re-invoke that same script and recurse; this keeps the Next step as `next build`.
export default {
  ...defineCloudflareConfig(),
  buildCommand: "bun scripts/embed-blog.ts && next build",
};
