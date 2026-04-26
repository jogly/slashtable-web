"use client";

import { Check } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { DownloadSection } from "@/components/sections/DownloadSection";
import { ContentContainer } from "@/components/ui/ContentContainer";
import { FadeIn } from "@/components/ui/FadeIn";
import { trackCheckoutCompleted } from "@/lib/analytics";

function CheckoutSuccessInner() {
  const searchParams = useSearchParams();
  const cid = searchParams.get("cid") ?? undefined;

  useEffect(() => {
    trackCheckoutCompleted({ checkout_id: cid });
  }, [cid]);

  return (
    <div className="pt-32">
      <ContentContainer>
        <FadeIn>
          <div className="mx-auto max-w-lg text-center">
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-accent/40 bg-accent/10">
              <Check className="h-6 w-6 text-accent" />
            </div>

            <p className="mb-3 font-mono text-accent text-xs uppercase tracking-widest">Order Complete</p>
            <h1 className="font-display text-4xl text-text lg:text-5xl">You're in.</h1>
            <p className="mx-auto mt-4 max-w-md text-lg text-text-secondary leading-relaxed">
              Your license key is on its way to your inbox. Paste it into Settings &rarr; License &rarr; Activate.
            </p>

            {cid && <p className="mt-6 font-mono text-text-muted text-xs">Checkout ref: {cid}</p>}
          </div>
        </FadeIn>
      </ContentContainer>

      <DownloadSection hideHeader />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessInner />
    </Suspense>
  );
}
