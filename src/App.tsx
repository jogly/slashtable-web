import { Nav } from "./components/layout/Nav";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./components/sections/Hero";
import { McpSection } from "./components/sections/McpSection";
import { NavigationSection } from "./components/sections/NavigationSection";
import { PluginSection } from "./components/sections/PluginSection";
import { FeaturesGrid } from "./components/sections/FeaturesGrid";
import { EarlyAccessBanner } from "./components/sections/EarlyAccessBanner";

export function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <EarlyAccessBanner />
        <NavigationSection />
        <McpSection />
        <PluginSection />
        <FeaturesGrid />
      </main>
      <Footer />
    </>
  );
}
