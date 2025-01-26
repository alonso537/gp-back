import { Request, Response } from "express";
import { CreateWorkDto, CustomError, UpdateWorkDto } from "../../domain";
import { WorkService } from "../services";

export class WorkController {
  constructor(public readonly workService: WorkService) {}

  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`Error: ${error}`);

    return res.status(500).json({ error: "Internal Server Error" });
  }

  create = (req: Request | any, res: Response | any) => {
    const [error, createWorkDto] = CreateWorkDto.create(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    this.workService
      .createTask(req.user.id, createWorkDto!)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  gettasks = (req: Request | any, res: Response | any) => {
    this.workService
      .getTasks(req.user.id)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  getTask = (req: Request | any, res: Response | any) => {
    this.workService
      .getTask(req.user.id, req.params.id)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  updateTask = (req: Request | any, res: Response | any) => {
    const [error, updateWorkDto] = UpdateWorkDto.create(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    this.workService
      .updateTask(req.user.id, req.params.id, updateWorkDto!)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  reassignTask = (req: Request | any, res: Response | any) => {
    const [error, updateWorkDto] = UpdateWorkDto.create(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    this.workService
      .reassingTask(req.user.id, req.params.id, updateWorkDto!)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  changeStatus = (req: Request | any, res: Response | any) => {
    const [error, updateWorkDto] = UpdateWorkDto.create(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    this.workService
      .changeTaskStatus(req.user.id, req.params.id, updateWorkDto!)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  changePriority = (req: Request | any, res: Response | any) => {
    const [error, updateWorkDto] = UpdateWorkDto.create(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    this.workService
      .changeTaskPriority(req.user.id, req.params.id, updateWorkDto!)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  }

  changeLimitDate = (req: Request | any, res: Response | any) => {
    const [error, updateWorkDto] = UpdateWorkDto.create(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    this.workService
      .changeTaskLimitDate(req.user.id, req.params.id, updateWorkDto!)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  }

    removeTask = (req: Request | any, res: Response | any) => {
        this.workService
        .deleteTask(req.user.id, req.params.id)
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            this.handleError(error, res);
        });
    }
}
