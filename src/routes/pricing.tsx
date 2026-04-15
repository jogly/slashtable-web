import { createFileRoute } from "@tanstack/react-router";
import { Check, Info } from "lucide-react";
import { useRef, useState } from "react";
import { ContactSalesModal } from "../components/ui/ContactSalesModal";
import { ContentContainer } from "../components/ui/ContentContainer";
import { FadeIn } from "../components/ui/FadeIn";
import { SkyParallax } from "../components/ui/SkyParallax";
import { ThankYouModal } from "../components/ui/ThankYouModal";
import { useDownload } from "../hooks/useDownload";
import { trackCheckoutClicked, trackContactSalesOpened } from "../lib/analytics";
import { PRICING, polarCheckoutUrl } from "../lib/copy";
import { cn } from "../lib/utils";

function parseDollars(price: string): number {
  const m = price.match(/\d+/);
  return m ? Number(m[0]) : 0;
}

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
});

function VaultTooltip() {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  function show() {
    clearTimeout(timeoutRef.current);
    setOpen(true);
  }

  function hide() {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  }

  return (
    <span className="relative inline-flex items-center">
      {PRICING.vaults.label}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onMouseEnter={show}
        onMouseLeave={hide}
        className="ml-1.5 text-text-muted transition-colors hover:text-text"
      >
        <Info className="h-3 w-3" />
      </button>
      {open && (
        <div
          onMouseEnter={show}
          onMouseLeave={hide}
          className="absolute top-full left-0 z-10 mt-2 w-56 border border-border bg-surface-2 p-3 shadow-lg shadow-shadow"
        >
          <ul className="space-y-2">
            {PRICING.vaults.providers.map((v) => (
              <li key={v.name} className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">{v.name}</span>
                <span
                  className={cn(
                    "font-mono text-[10px] uppercase tracking-widest",
                    v.status === "available" ? "text-green" : "text-text-muted",
                  )}
                >
                  {v.status === "available" ? "Ready" : "Planned"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </span>
  );
}

function PricingPage() {
  const { showThankYou, closeThankYou, triggerDownload } = useDownload();
  const [showContactSales, setShowContactSales] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Biggest discount across individual tiers — we give that badge extra visual weight.
  const individualTiers = PRICING.tiers.slice(0, 3);
  const biggestDiscount = Math.max(
    ...individualTiers.map((t) => {
      if (!("salePrice" in t) || !t.salePrice) return 0;
      return parseDollars(t.price) - parseDollars(t.salePrice);
    }),
  );

  return (
    <div className="pt-32 pb-20">
      <ContentContainer>
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="mb-3 font-mono text-accent text-xs uppercase tracking-widest">{PRICING.eyebrow}</p>
          <h1 className="font-display text-4xl text-text tracking-tight lg:text-5xl">{PRICING.heading}</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-text-secondary leading-relaxed">{PRICING.description}</p>
        </div>

        {/* Early-access banner — friendly sky-parallax card, no warning styling */}
        <FadeIn>
          <div
            ref={bannerRef}
            className="relative mx-auto mb-10 max-w-4xl overflow-hidden border border-border bg-surface-1/30 px-5 py-5 backdrop-blur-sm lg:px-7 lg:py-6"
          >
            <SkyParallax targetRef={bannerRef} />
            <div className="relative z-10 flex items-start gap-4 lg:items-center">
              <span className="mt-0.5 font-mono text-lg text-accent leading-none lg:text-xl">✦</span>
              <div className="flex-1">
                <p className="font-mono text-[10px] text-accent uppercase tracking-widest">
                  {PRICING.earlyAccess.eyebrow}
                </p>
                <p className="mt-1 text-sm text-text-secondary leading-relaxed">{PRICING.earlyAccess.body}</p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Individual tiers */}
        <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-3">
          {individualTiers.map((tier, i) => {
            const highlighted = i === 1;
            const salePrice = "salePrice" in tier ? tier.salePrice : undefined;
            const hasDiscount = !!salePrice;
            const discountAmount = hasDiscount ? parseDollars(tier.price) - parseDollars(salePrice) : 0;
            const isBestDeal = hasDiscount && discountAmount === biggestDiscount;
            return (
              <FadeIn key={tier.name} delay={i * 0.1}>
                <div
                  className={cn(
                    "relative flex h-full flex-col border p-8",
                    highlighted ? "border-accent/40 bg-surface-2" : "border-border bg-surface",
                  )}
                >
                  {highlighted && (
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
                  )}

                  {hasDiscount &&
                    (isBestDeal ? (
                      <div className="-translate-y-1/2 absolute top-0 right-4 flex items-center gap-1.5 bg-accent px-3.5 py-1.5 font-mono font-semibold text-white text-xs uppercase tracking-widest shadow-[0_0_24px_-2px_var(--color-accent),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(0,0,0,0.18)]">
                        <span className="h-1 w-1 rounded-full bg-white/80 shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
                        <span>${discountAmount} off</span>
                      </div>
                    ) : (
                      <div className="-translate-y-1/2 absolute top-0 right-4 border border-accent/40 bg-surface px-3 py-1 font-mono text-[10px] text-accent uppercase tracking-widest">
                        ${discountAmount} off
                      </div>
                    ))}

                  <div className="flex-1">
                    <div className="mb-6">
                      <h2 className="font-mono text-text-muted text-xs uppercase tracking-widest">{tier.name}</h2>
                      <div className="mt-3 flex items-baseline gap-2">
                        {hasDiscount && salePrice ? (
                          <>
                            <span className="font-display text-4xl text-text">{salePrice}</span>
                            <span className="font-display text-lg text-text-muted line-through">{tier.price}</span>
                          </>
                        ) : (
                          <span className="font-display text-4xl text-text">{tier.price}</span>
                        )}
                        {tier.price !== "$0" && <span className="font-mono text-text-muted text-xs">one-time</span>}
                      </div>
                      <p className="mt-2 text-sm text-text-secondary">{tier.description}</p>
                    </div>

                    {tier.price !== "$0" && (
                      <p className="mb-6 font-mono text-text-muted text-xs">{PRICING.perpetual}</p>
                    )}
                  </div>

                  <ul className="mb-8 space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-text-secondary">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                        {feature === PRICING.vaults.label ? <VaultTooltip /> : feature}
                      </li>
                    ))}
                    {tier.role ? (
                      <li className="flex items-start gap-2.5 text-sm text-text-secondary">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                        <span>
                          Discord{" "}
                          <span className="font-semibold" style={{ color: tier.role.color }}>
                            {tier.role.tag}
                          </span>{" "}
                          role
                        </span>
                      </li>
                    ) : (
                      <li className="invisible text-sm">&nbsp;</li>
                    )}
                  </ul>

                  {i === 0 ? (
                    <button
                      type="button"
                      onClick={() => triggerDownload("pricing_free_tier")}
                      className="flex items-center justify-center rounded-[6px] border border-border-strong border-dashed bg-bg/40 px-5 py-[calc(0.625rem-1px)] font-mono text-text-secondary text-xs uppercase tracking-widest transition-[background-color,border-color,color] duration-150 hover:border-text/50 hover:bg-bg/70 hover:text-text"
                    >
                      {tier.cta}
                    </button>
                  ) : (
                    <a
                      href={polarCheckoutUrl(tier.polarId as string)}
                      onClick={() =>
                        trackCheckoutClicked({
                          tier: tier.name,
                          price: salePrice ?? tier.price,
                          discount_active: hasDiscount,
                          discount_amount: hasDiscount ? `$${discountAmount} off` : null,
                          polar_id: tier.polarId as string,
                        })
                      }
                      className={cn(
                        "group relative flex items-center justify-center overflow-hidden rounded-[6px] font-mono text-xs uppercase tracking-widest transition-[background-color,border-color,box-shadow,color] duration-150",
                        highlighted
                          ? "bg-accent px-5 py-2.5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.12)] hover:bg-[color-mix(in_srgb,var(--color-accent)_92%,white)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.12)] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.12)]"
                          : "border border-border-strong border-dashed bg-bg/40 px-5 py-[calc(0.625rem-1px)] text-text-secondary hover:border-text/50 hover:bg-bg/70 hover:text-text",
                      )}
                    >
                      {tier.cta}
                    </a>
                  )}
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Team tier */}
        {(() => {
          const team = PRICING.tiers[3];
          return (
            <FadeIn delay={0.3}>
              <div className="relative mx-auto mt-6 max-w-4xl border border-border bg-surface p-8 lg:p-10">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                  <div className="lg:max-w-xs">
                    <h2 className="font-mono text-text-muted text-xs uppercase tracking-widest">{team.name}</h2>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="font-display text-4xl text-text">{team.price}</span>
                      <span className="font-mono text-text-muted text-xs">{team.pricePer}</span>
                    </div>
                    <p className="mt-1 font-mono text-[10px] text-text-muted">{team.priceBilling}</p>
                    {team.description && <p className="mt-2 text-sm text-text-secondary">{team.description}</p>}
                    <p className="mt-2 font-mono text-text-muted text-xs">{team.priceAlt}</p>
                  </div>

                  <ul className="flex-1 space-y-3">
                    {team.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-text-secondary">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                        {feature === PRICING.vaults.label ? <VaultTooltip /> : feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => {
                      trackContactSalesOpened({ source: "pricing_team_tier" });
                      setShowContactSales(true);
                    }}
                    className="flex shrink-0 items-center justify-center rounded-[6px] border border-border-strong border-dashed bg-bg/40 px-5 py-[calc(0.625rem-1px)] font-mono text-text-secondary text-xs uppercase tracking-widest transition-[background-color,border-color,color] duration-150 hover:border-text/50 hover:bg-bg/70 hover:text-text"
                  >
                    {team.cta}
                  </button>
                </div>
              </div>
            </FadeIn>
          );
        })()}

        {/* FAQ */}
        <div className="mx-auto mt-24 max-w-narrow">
          <h2 className="mb-8 font-display text-2xl text-text tracking-tight">{PRICING.faq.heading}</h2>
          <div className="border-border border-t">
            {PRICING.faq.items.map((item) => (
              <div key={item.q} className="border-border border-b py-6">
                <h3 className="font-medium font-mono text-sm text-text">{item.q}</h3>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </ContentContainer>

      <ThankYouModal open={showThankYou} onClose={closeThankYou} />
      <ContactSalesModal open={showContactSales} onClose={() => setShowContactSales(false)} />
    </div>
  );
}
