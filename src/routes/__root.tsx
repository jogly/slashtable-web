import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Footer } from "../components/layout/Footer";
import { Nav } from "../components/layout/Nav";

export const Route = createRootRoute({
  component: () => (
    <>
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  ),
});
