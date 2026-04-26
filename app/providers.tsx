"use client";

import posthog from "posthog-js";
import { useEffect } from "react";
import { AnalyticsProvider } from "@/components/providers/PostHogProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

function PostHogInit() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
    if (!token) return;
    posthog.init(token, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: "identified_only",
      capture_pageview: false,
      opt_out_capturing_by_default: true,
    });
    const consent = localStorage.getItem("cookie-consent");
    if (consent === "accepted") posthog.opt_in_capturing();
  }, []);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <PostHogInit />
      <AnalyticsProvider>{children}</AnalyticsProvider>
    </ThemeProvider>
  );
}
