import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-static";

/**
 * Own robots.txt with Content Signals (ai-train=no) so training preference
 * stays even after Cloudflare managed robots.txt is turned off.
 * Managed CF robots prepends Disallow for GPTBot/ClaudeBot which fails Ora.
 */
export function GET() {
  const body = `# Content Signals: https://contentsignals.org/
# search=yes: indexing and link/excerpt search results are allowed.
# ai-train=no: training or fine-tuning models is not allowed.
# use=reference: index, excerpt, and link back; do not reproduce in full.

User-agent: *
Content-Signal: search=yes,ai-train=no,use=reference
Allow: /
Disallow: /checkout/
Disallow: /upgrade/

Host: ${SITE_URL}
Sitemap: ${SITE_URL}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
