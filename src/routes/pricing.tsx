import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Info } from "lucide-react";
import { useRef, useState } from "react";
import { useDownload } from "../hooks/useDownload";
import { PRICING } from "../lib/copy";
import { cn } from "../lib/utils";
import { ContactSalesModal } from "../components/ui/ContactSalesModal";
import { ContentContainer } from "../components/ui/ContentContainer";
import { FadeIn } from "../components/ui/FadeIn";
import { ThankYouModal } from "../components/ui/ThankYouModal";

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
          className="absolute top-full left-0 z-10 mt-2 w-56 border border-border bg-surface-2 p-3 shadow-lg shadow-black/40"
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

  return (
    <div className="pt-32 pb-20">
      <ContentContainer>
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 font-mono text-xs text-accent uppercase tracking-widest">{PRICING.eyebrow}</p>
          <h1 className="font-display text-4xl text-text tracking-tight lg:text-5xl">{PRICING.heading}</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-text-secondary leading-relaxed">{PRICING.description}</p>
        </div>

        {/* Individual tiers */}
        <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-3">
          {PRICING.tiers.slice(0, 3).map((tier, i) => {
            const highlighted = i === 1;
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

                  <div className="flex-1">
                    <div className="mb-6">
                      <h2 className="font-mono text-xs text-text-muted uppercase tracking-widest">{tier.name}</h2>
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="font-display text-4xl text-text">{tier.price}</span>
                        {tier.price !== "$0" && <span className="font-mono text-xs text-text-muted">one-time</span>}
                      </div>
                      <p className="mt-2 text-sm text-text-secondary">{tier.description}</p>
                    </div>

                    {tier.price !== "$0" && (
                      <p className="mb-6 font-mono text-xs text-text-muted">{PRICING.perpetual}</p>
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
                      onClick={triggerDownload}
                      className="flex items-center justify-center rounded-full border border-border-strong px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-text-secondary transition-colors hover:border-white hover:text-white"
                    >
                      {tier.cta}
                    </button>
                  ) : (
                    <Link
                      to="/"
                      hash="download"
                      className={cn(
                        "flex items-center justify-center rounded-full px-5 py-2.5 font-mono text-xs uppercase tracking-widest transition-colors",
                        highlighted
                          ? "bg-accent text-black hover:bg-white"
                          : "border border-border-strong text-text-secondary hover:border-white hover:text-white",
                      )}
                    >
                      {tier.cta}
                    </Link>
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
                    <h2 className="font-mono text-xs text-text-muted uppercase tracking-widest">{team.name}</h2>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="font-display text-4xl text-text">{team.price}</span>
                      <span className="font-mono text-xs text-text-muted">{team.pricePer}</span>
                    </div>
                    <p className="mt-1 font-mono text-[10px] text-text-muted">{team.priceBilling}</p>
                    {team.description && <p className="mt-2 text-sm text-text-secondary">{team.description}</p>}
                    <p className="mt-2 font-mono text-xs text-text-muted">{team.priceAlt}</p>
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
                    onClick={() => setShowContactSales(true)}
                    className="flex shrink-0 items-center justify-center rounded-full border border-border-strong px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-text-secondary transition-colors hover:border-white hover:text-white"
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
                <h3 className="font-mono text-sm font-medium text-text">{item.q}</h3>
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
