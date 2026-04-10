import { useRouter } from "@tanstack/react-router";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, type ReactNode } from "react";

function PageviewTracker() {
  const router = useRouter();

  useEffect(() => {
    posthog.capture("$pageview");

    const unsubscribe = router.subscribe("onResolved", (event) => {
      if (!event.pathChanged) return;
      posthog.capture("$pageview");
    });

    return unsubscribe;
  }, [router]);

  return null;
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <PageviewTracker />
      {children}
    </PHProvider>
  );
}
