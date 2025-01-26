import { Router } from "express";
import { AuthController } from "./controller";
import { AuthService } from "../services";
import { authMiddleware } from "../middlewares";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    const authService = new AuthService();
    const constroller = new AuthController(authService);

    router.post("/register", constroller.register);
    router.post("/login", constroller.login);
    router.get("/get-me", authMiddleware.authenticate, constroller.getUser);
    router.patch(
      "/update",
      authMiddleware.authenticate,
      constroller.updateUser
    );
    router.patch(
      "/update/:id",
      authMiddleware.authenticate,
      constroller.changeRole
    );

    return router;
  }
}
