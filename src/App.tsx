import { Nav } from "./components/layout/Nav";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./components/sections/Hero";
import { McpSection } from "./components/sections/McpSection";
import { NavigationSection } from "./components/sections/NavigationSection";
import { PluginSection } from "./components/sections/PluginSection";
import { FeaturesGrid } from "./components/sections/FeaturesGrid";
import { DatabaseSupport } from "./components/sections/DatabaseSupport";

export function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <McpSection />
        <NavigationSection />
        <PluginSection />
        <FeaturesGrid />
        <DatabaseSupport />
      </main>
      <Footer />
    </>
  );
}
