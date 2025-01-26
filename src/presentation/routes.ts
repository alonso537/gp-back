import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { ProjectRoutes } from "./project/routes";
import { WorkRoute } from "./work/routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use("/api/auth", AuthRoutes.routes);
    router.use("/api/project", ProjectRoutes.routes);
    router.use("/api/task", WorkRoute.routes);

    return router;
  }
}
