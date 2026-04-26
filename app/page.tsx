import { CommunitySection } from "@/components/sections/CommunitySection";
import { ConnectSection } from "@/components/sections/ConnectSection";
import { DownloadSection } from "@/components/sections/DownloadSection";
import { FeaturesGrid } from "@/components/sections/FeaturesGrid";
import { Hero } from "@/components/sections/Hero";
import { McpSection } from "@/components/sections/McpSection";
import { NavigationSection } from "@/components/sections/NavigationSection";
import { PluginSection } from "@/components/sections/PluginSection";
import { SchemaGraphSection } from "@/components/sections/SchemaGraphSection";
import { ValuePillars } from "@/components/sections/ValuePillars";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValuePillars />
      <ConnectSection />
      <NavigationSection />
      <SchemaGraphSection />
      <PluginSection />
      <McpSection />
      <FeaturesGrid />
      <DownloadSection />
      <CommunitySection />
    </>
  );
}
