import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Footer } from "../components/layout/Footer";
import { Nav } from "../components/layout/Nav";
import { CookieConsent } from "../components/ui/CookieConsent";
import { LayoutGuides } from "../components/ui/LayoutGuides";

export const Route = createRootRoute({
  component: () => (
    <>
      <LayoutGuides />
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
    </>
  ),
});
