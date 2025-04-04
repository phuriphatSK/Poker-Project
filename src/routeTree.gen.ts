/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from "@tanstack/react-router";

// Import Routes

import { Route as rootRoute } from "./routes/__root";
import { Route as JoinidImport } from "./routes/joinid";
import { Route as CreateroomImport } from "./routes/createroom";
import { Route as AtlassianImport } from "./routes/atlassian";
import { Route as IndexImport } from "./routes/index";
import { Route as RoomRoomIdImport } from "./routes/room/$roomId";
import { Route as JoinqrRoomIdImport } from "./routes/joinqr/$roomId";

// Create Virtual Routes

const LoginLazyImport = createFileRoute("/login")();

// Create/Update Routes

const LoginLazyRoute = LoginLazyImport.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => rootRoute,
} as any).lazy(() => import("./routes/login.lazy").then((d) => d.Route));

const JoinidRoute = JoinidImport.update({
  id: "/joinid",
  path: "/joinid",
  getParentRoute: () => rootRoute,
} as any);

const CreateroomRoute = CreateroomImport.update({
  id: "/createroom",
  path: "/createroom",
  getParentRoute: () => rootRoute,
} as any);

const AtlassianRoute = AtlassianImport.update({
  id: "/atlassian",
  path: "/atlassian",
  getParentRoute: () => rootRoute,
} as any);

const IndexRoute = IndexImport.update({
  id: "/",
  path: "/",
  getParentRoute: () => rootRoute,
} as any);

const RoomRoomIdRoute = RoomRoomIdImport.update({
  id: "/room/$roomId",
  path: "/room/$roomId",
  getParentRoute: () => rootRoute,
} as any);

const JoinqrRoomIdRoute = JoinqrRoomIdImport.update({
  id: "/joinqr/$roomId",
  path: "/joinqr/$roomId",
  getParentRoute: () => rootRoute,
} as any);

// Populate the FileRoutesByPath interface

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      id: "/";
      path: "/";
      fullPath: "/";
      preLoaderRoute: typeof IndexImport;
      parentRoute: typeof rootRoute;
    };
    "/atlassian": {
      id: "/atlassian";
      path: "/atlassian";
      fullPath: "/atlassian";
      preLoaderRoute: typeof AtlassianImport;
      parentRoute: typeof rootRoute;
    };
    "/createroom": {
      id: "/createroom";
      path: "/createroom";
      fullPath: "/createroom";
      preLoaderRoute: typeof CreateroomImport;
      parentRoute: typeof rootRoute;
    };
    "/joinid": {
      id: "/joinid";
      path: "/joinid";
      fullPath: "/joinid";
      preLoaderRoute: typeof JoinidImport;
      parentRoute: typeof rootRoute;
    };
    "/login": {
      id: "/login";
      path: "/login";
      fullPath: "/login";
      preLoaderRoute: typeof LoginLazyImport;
      parentRoute: typeof rootRoute;
    };
    "/joinqr/$roomId": {
      id: "/joinqr/$roomId";
      path: "/joinqr/$roomId";
      fullPath: "/joinqr/$roomId";
      preLoaderRoute: typeof JoinqrRoomIdImport;
      parentRoute: typeof rootRoute;
    };
    "/room/$roomId": {
      id: "/room/$roomId";
      path: "/room/$roomId";
      fullPath: "/room/$roomId";
      preLoaderRoute: typeof RoomRoomIdImport;
      parentRoute: typeof rootRoute;
    };
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  "/": typeof IndexRoute;
  "/atlassian": typeof AtlassianRoute;
  "/createroom": typeof CreateroomRoute;
  "/joinid": typeof JoinidRoute;
  "/login": typeof LoginLazyRoute;
  "/joinqr/$roomId": typeof JoinqrRoomIdRoute;
  "/room/$roomId": typeof RoomRoomIdRoute;
}

export interface FileRoutesByTo {
  "/": typeof IndexRoute;
  "/atlassian": typeof AtlassianRoute;
  "/createroom": typeof CreateroomRoute;
  "/joinid": typeof JoinidRoute;
  "/login": typeof LoginLazyRoute;
  "/joinqr/$roomId": typeof JoinqrRoomIdRoute;
  "/room/$roomId": typeof RoomRoomIdRoute;
}

export interface FileRoutesById {
  __root__: typeof rootRoute;
  "/": typeof IndexRoute;
  "/atlassian": typeof AtlassianRoute;
  "/createroom": typeof CreateroomRoute;
  "/joinid": typeof JoinidRoute;
  "/login": typeof LoginLazyRoute;
  "/joinqr/$roomId": typeof JoinqrRoomIdRoute;
  "/room/$roomId": typeof RoomRoomIdRoute;
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath;
  fullPaths:
    | "/"
    | "/atlassian"
    | "/createroom"
    | "/joinid"
    | "/login"
    | "/joinqr/$roomId"
    | "/room/$roomId";
  fileRoutesByTo: FileRoutesByTo;
  to:
    | "/"
    | "/atlassian"
    | "/createroom"
    | "/joinid"
    | "/login"
    | "/joinqr/$roomId"
    | "/room/$roomId";
  id:
    | "__root__"
    | "/"
    | "/atlassian"
    | "/createroom"
    | "/joinid"
    | "/login"
    | "/joinqr/$roomId"
    | "/room/$roomId";
  fileRoutesById: FileRoutesById;
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute;
  AtlassianRoute: typeof AtlassianRoute;
  CreateroomRoute: typeof CreateroomRoute;
  JoinidRoute: typeof JoinidRoute;
  LoginLazyRoute: typeof LoginLazyRoute;
  JoinqrRoomIdRoute: typeof JoinqrRoomIdRoute;
  RoomRoomIdRoute: typeof RoomRoomIdRoute;
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AtlassianRoute: AtlassianRoute,
  CreateroomRoute: CreateroomRoute,
  JoinidRoute: JoinidRoute,
  LoginLazyRoute: LoginLazyRoute,
  JoinqrRoomIdRoute: JoinqrRoomIdRoute,
  RoomRoomIdRoute: RoomRoomIdRoute,
};

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>();

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/atlassian",
        "/createroom",
        "/joinid",
        "/login",
        "/joinqr/$roomId",
        "/room/$roomId"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/atlassian": {
      "filePath": "atlassian.tsx"
    },
    "/createroom": {
      "filePath": "createroom.tsx"
    },
    "/joinid": {
      "filePath": "joinid.tsx"
    },
    "/login": {
      "filePath": "login.lazy.tsx"
    },
    "/joinqr/$roomId": {
      "filePath": "joinqr/$roomId.tsx"
    },
    "/room/$roomId": {
      "filePath": "room/$roomId.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
