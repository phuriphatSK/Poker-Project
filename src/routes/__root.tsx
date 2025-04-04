import { createRootRoute, Outlet } from "@tanstack/react-router";
import React, { Suspense } from "react";
import Navbar from "../components/Navbar";

// import Login from "../pages/Login/Login";
const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null // Render nothing in production
  : React.lazy(() =>
      // Lazy load in development
      import("@tanstack/router-devtools").then((res) => ({
        default: res.TanStackRouterDevtools,
        // For Embedded Mode
        // default: res.TanStackRouterDevtoolsPanel
      }))
    );

export const Route = createRootRoute({
  component: () => (
    <div>
      <Outlet />
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </div>
  ),
  notFoundComponent() {
    return (
      <div className="h-dvh w-full">
        <Navbar className="fixed" />
        <main className="h-full flex flex-col items-center justify-center">
          <span className="text-9xl">404</span>
          <h1 className="text-5xl">Page Not Found</h1>
        </main>
      </div>
    );
  },
});
