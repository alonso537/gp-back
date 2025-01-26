import { Response, Request } from "express";
import { ProjectService } from "../services";
import { CreateProjectDto, CustomError, UpdateProjectDto } from "../../domain";

export class ProjectController {
  constructor(public readonly projectService: ProjectService) {}

  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`Error: ${error}`);

    return res.status(500).json({ error: "Internal Server Error" });
  }

  create = (req: Request | any, res: Response | any) => {
    const [error, createProjectDto] = CreateProjectDto.create(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    this.projectService
      .createProject(createProjectDto!, req.user.id)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  getProjects = (req: Request | any, res: Response | any) => {
    this.projectService
      .getProjects(req.user.id)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  getProject = (req: Request | any, res: Response | any) => {
    this.projectService
      .getProject(req.user.id, req.params.id)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  updateProject = (req: Request | any, res: Response | any) => {
    const [error, updateProjectDto] = UpdateProjectDto.update(req.body);

    console.log(req.params.id);

    if (error) {
      return res.status(400).json({ error });
    }

    this.projectService
      .updateProject(req.user.id, req.params.id, updateProjectDto!)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  addMembers = (req: Request | any, res: Response | any) => {
    const [error, updateProjectDto] = UpdateProjectDto.update(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    this.projectService
      .addMembers(req.user.id, req.params.id, updateProjectDto!)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  removeMember = (req: Request | any, res: Response | any) => {
    const [error, updateProjectDto] = UpdateProjectDto.update(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    this.projectService
      .removeMembers(req.user.id, req.params.id, updateProjectDto!)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  changeStatus = (req: Request | any, res: Response | any) => {
    const [error, updateProjectDto] = UpdateProjectDto.update(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    this.projectService
      .changeStatus(req.user.id, req.params.id, updateProjectDto!)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  changeLimitDate = (req: Request | any, res: Response | any) => {
    const [error, updateProjectDto] = UpdateProjectDto.update(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    this.projectService
      .changeLimitDate(req.user.id, req.params.id, updateProjectDto!)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  removeProject = (req: Request | any, res: Response | any) => {
    this.projectService
      .deleteProject(req.user.id, req.params.id)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };
}
