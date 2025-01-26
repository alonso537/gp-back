import { Router } from "express";
import { WorkService } from "../services";
import { WorkController } from "./controller";
import { authMiddleware } from "../middlewares";


export class WorkRoute {
    static get routes() : Router {
        const router = Router();

        const workService = new WorkService();
        const workController = new WorkController(workService);

        router.post('/create', authMiddleware.authenticate, workController.create);
        router.get('/', authMiddleware.authenticate, workController.gettasks);
        router.get('/:id', authMiddleware.authenticate, workController.getTask);
        router.patch('/:id', authMiddleware.authenticate, workController.updateTask);
        router.patch('/:id/reassing-task', authMiddleware.authenticate, workController.reassignTask);
        router.patch('/:id/status', authMiddleware.authenticate, workController.changeStatus);
        router.patch('/:id/priority', authMiddleware.authenticate, workController.changePriority);
        router.patch('/:id/date', authMiddleware.authenticate, workController.changeLimitDate);
        router.delete('/:id', authMiddleware.authenticate, workController.removeTask);

        return router
    }
}