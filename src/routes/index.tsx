import { createFileRoute } from "@tanstack/react-router";
import { CommunitySection } from "../components/sections/CommunitySection";
import { DownloadSection } from "../components/sections/DownloadSection";
import { FeaturesGrid } from "../components/sections/FeaturesGrid";
import { Hero } from "../components/sections/Hero";
import { McpSection } from "../components/sections/McpSection";
import { NavigationSection } from "../components/sections/NavigationSection";
import { PluginSection } from "../components/sections/PluginSection";
import { SchemaGraphSection } from "../components/sections/SchemaGraphSection";
import { ValuePillars } from "../components/sections/ValuePillars";

export const Route = createFileRoute("/")({
  component: () => (
    <>
      <Hero />
      <ValuePillars />
      <McpSection />
      <NavigationSection />
      <PluginSection />
      <SchemaGraphSection />
      <FeaturesGrid />
      <DownloadSection />
      <CommunitySection />
    </>
  ),
});
