import { createFileRoute } from "@tanstack/react-router";
import { CommunitySection } from "../components/sections/CommunitySection";
import { DownloadSection } from "../components/sections/DownloadSection";
import { EarlyAccessBanner } from "../components/sections/EarlyAccessBanner";
import { FeaturesGrid } from "../components/sections/FeaturesGrid";
import { Hero } from "../components/sections/Hero";

export const Route = createFileRoute("/")({
  component: () => (
    <>
      <Hero />
      <EarlyAccessBanner />
      <FeaturesGrid />
      <DownloadSection />
      <CommunitySection />
    </>
  ),
});
