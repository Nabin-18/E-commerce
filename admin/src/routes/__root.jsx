import Sidebar from "@/components/custom/Sidebar";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <main className="flex h-screen w-screen">
        <Sidebar />
        <div className="flex-1 max-h-screen">
          <Outlet />
        </div>
      </main>
    </>
  ),
});
