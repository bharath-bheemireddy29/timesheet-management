import express, { Router } from "express";
import authRoute from "./auth.route";
import userRoute from "./user.route";
import absenceRoute from "./absence.route";

import docsRoute from "./doc.route";
import config from "../../../config/config";

const router: Router = express.Router();

interface Route {
  path: string;
  route: Router;
}

const defaultRoutes: Route[] = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/absences",
    route: absenceRoute,
  },
];

const devRoutes: Route[] = [
  {
    path: "/docs",
    route: docsRoute,
  },
];

defaultRoutes.forEach((route: Route) => {
  router.use(route.path, route.route);
});

if (config.env === "development") {
  devRoutes.forEach((route: Route) => {
    router.use(route.path, route.route);
  });
}

export default router;
