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
      <ConnectSection
        groupHeading="Connect and work where you already are"
        groupHeadingId="group-connect-heading"
      />
      <NavigationSection
        groupHeading="Navigate schema and data"
        groupHeadingId="group-navigate-heading"
      />
      <SchemaGraphSection />
      <PluginSection
        groupHeading="Extend with plugins and agents"
        groupHeadingId="group-extend-heading"
      />
      <McpSection />
      <FeaturesGrid
        groupHeading="More of the client"
        groupHeadingId="group-features-heading"
      />
      <DownloadSection
        groupHeading="Get the app"
        groupHeadingId="group-download-heading"
      />
      <CommunitySection
        groupHeading="Community"
        groupHeadingId="group-community-heading"
      />
    </>
  );
}
