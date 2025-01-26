import { Router } from "express";
import { ProjectService } from "../services";
import { ProjectController } from "./controller";
import { authMiddleware } from "../middlewares";

export class ProjectRoutes {
  static get routes(): Router {
    const router = Router();

    const projectService = new ProjectService();
    const controller = new ProjectController(projectService);

    router.post("/create", authMiddleware.authenticate, controller.create);
    router.get("/", authMiddleware.authenticate, controller.getProjects);
    router.get("/:id", authMiddleware.authenticate, controller.getProject);
    router.patch("/:id", authMiddleware.authenticate, controller.updateProject);
    router.patch("/:id/members", authMiddleware.authenticate, controller.addMembers);
    router.patch("/:id/remove-member", authMiddleware.authenticate, controller.removeMember);
    router.patch("/:id/status", authMiddleware.authenticate, controller.changeStatus);
    router.patch("/:id/date", authMiddleware.authenticate, controller.changeLimitDate);
    router.delete("/:id", authMiddleware.authenticate, controller.removeProject);

    return router;
  }
}
