import { createFileRoute } from "@tanstack/react-router";
import { CommunitySection } from "../components/sections/CommunitySection";
import { DownloadSection } from "../components/sections/DownloadSection";
import { EarlyAccessBanner } from "../components/sections/EarlyAccessBanner";
import { FeaturesGrid } from "../components/sections/FeaturesGrid";
import { Hero } from "../components/sections/Hero";
import { McpSection } from "../components/sections/McpSection";
import { NavigationSection } from "../components/sections/NavigationSection";
import { SchemaGraphSection } from "../components/sections/SchemaGraphSection";
import { ValuePillars } from "../components/sections/ValuePillars";

export const Route = createFileRoute("/")({
  component: () => (
    <>
      <Hero />
      <ValuePillars />
      <EarlyAccessBanner />
      <NavigationSection />
      <McpSection />
      <SchemaGraphSection />
      <FeaturesGrid />
      <DownloadSection />
      <CommunitySection />
    </>
  ),
});
