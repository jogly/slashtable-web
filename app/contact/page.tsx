import Link from "next/link";

const DISCORD = "https://discord.gg/xR2VdkfnJQ";
const SALES_EMAIL = "sales@slashtable.dev";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-narrow px-6 pt-32 pb-20">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-2 w-2 flex-shrink-0 bg-accent" />
        <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">Company</span>
      </div>
      <h1 className="font-display text-4xl text-text">Contact</h1>
      <p className="mt-4 text-sm text-text-secondary leading-relaxed">
        Reach Make Toast LLC about /table for product questions, team licensing, and community
        support. Prefer Discord for day-to-day discussion; use the sales address for team plans.
      </p>

      <div className="mt-12 space-y-10 border-border border-t pt-10">
        <section>
          <h2 className="mb-3 font-display text-text text-xl">Discord</h2>
          <p className="mb-4 text-sm text-text-secondary leading-relaxed">
            The primary public channel for bug reports, feature requests, install help, and MCP
            setup questions. Most product conversation happens here.
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            <a
              href={DISCORD}
              className="text-accent underline underline-offset-2 transition-colors hover:text-text"
            >
              {DISCORD}
            </a>
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-text text-xl">Sales and team licensing</h2>
          <p className="mb-4 text-sm text-text-secondary leading-relaxed">
            For Team plan questions, seat counts, or procurement, email the sales address used on
            the pricing page. Personal and Pro licenses are self-serve checkout.
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            <a
              href={`mailto:${SALES_EMAIL}`}
              className="text-accent underline underline-offset-2 transition-colors hover:text-text"
            >
              {SALES_EMAIL}
            </a>
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-text text-xl">Social</h2>
          <p className="mb-4 text-sm text-text-secondary leading-relaxed">
            Release notes and short product updates are posted on X.
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            <a
              href="https://x.com/slashtable"
              className="text-accent underline underline-offset-2 transition-colors hover:text-text"
            >
              https://x.com/slashtable
            </a>
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-text text-xl">Related pages</h2>
          <ul className="space-y-2">
            <li className="flex items-start gap-2.5 text-sm text-text-secondary leading-relaxed">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-muted" />
              <span>
                <Link href="/about" className="text-accent underline underline-offset-2 transition-colors hover:text-text">
                  About
                </Link>{" "}
                Make Toast LLC and the /table product
              </span>
            </li>
            <li className="flex items-start gap-2.5 text-sm text-text-secondary leading-relaxed">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-muted" />
              <span>
                <Link href="/developers" className="text-accent underline underline-offset-2 transition-colors hover:text-text">
                  Developers
                </Link>{" "}
                portal for OpenAPI, llms.txt, /blog, and local MCP discovery
              </span>
            </li>
            <li className="flex items-start gap-2.5 text-sm text-text-secondary leading-relaxed">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-muted" />
              <span>
                <Link href="/privacy" className="text-accent underline underline-offset-2 transition-colors hover:text-text">
                  Privacy
                </Link>{" "}
                and{" "}
                <Link href="/terms" className="text-accent underline underline-offset-2 transition-colors hover:text-text">
                  Terms
                </Link>
              </span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
