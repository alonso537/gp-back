import { ProjectModel, UserModel, WorkModel } from "../../data/index.ts";
import {
  CreateWorkDto,
  CustomError,
  UpdateWorkDto,
  WorkEntity,
} from "../../domain";

export class WorkService {
  constructor() {}

  // Helper para verificar si un usuario existe y lanzar errores apropiados
  private async verifyUser(userId: string, roleCheck?: string): Promise<any> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw CustomError.notFound("User not found");
    }
    if (roleCheck && !user.role.includes(roleCheck)) {
      throw CustomError.forbidden(`User must have role: ${roleCheck}`);
    }
    return user;
  }

  public async createTask(userId: string, createWorkDto: CreateWorkDto) {
    try {
      const now = new Date();
      const limit = new Date(createWorkDto.limitDate);

      // Validar que la fecha límite sea válida
      if (limit < now) {
        throw CustomError.badRequest(
          "Limit date must be greater than the current date"
        );
      }

      // Verificar que el usuario creador existe y tiene permisos
      await this.verifyUser(userId, "ADMIN_ROLE");

      // Verificar que el proyecto asociado existe
      const project = await ProjectModel.findById(createWorkDto.project);
      if (!project) {
        throw CustomError.notFound("Project not found");
      }

      // Validar que la fecha límite de la tarea no supere la del proyecto
      if (limit > project.limitDate) {
        throw CustomError.badRequest(
          "Limit date must not exceed the project's limit date"
        );
      }

      // Validar que el usuario asignado existe
      const assigningTo = await UserModel.findById(createWorkDto.assigningTo);
      if (!assigningTo) {
        throw CustomError.notFound("User to assign not found");
      }

      // Si el usuario asignado no está en el proyecto, agregarlo
      if (!project.members.includes(assigningTo._id)) {
        project.members.push(assigningTo._id);
        await project.save();
      }

      // Crear la tarea
      const work = await WorkModel.create({
        ...createWorkDto,
      });

      // Retornar la tarea creada como entidad
      return { task: WorkEntity.fromObject(work) };
    } catch (error) {
      throw CustomError.internal(`Error creating task: ${error}`);
    }
  }

  public async getTasks(userId: string) {
    try {
      // Verificar si el usuario existe
      const user = await this.verifyUser(userId);

      // Determinar los criterios de búsqueda según el rol del usuario
      const filter = user.role.includes("ADMIN_ROLE")
        ? {}
        : { assigningTo: user._id };

      // Obtener las tareas según el filtro definido
      const works = await WorkModel.find(filter)
        .populate("project")
        .populate("assigningTo");

      // Mapear las tareas a la entidad correspondiente y retornarlas
      return { tasks: works.map((work) => WorkEntity.fromObject(work)) };
    } catch (error) {
      throw CustomError.internal(`Error getting tasks: ${error}`);
    }
  }

  public async getTask(userId: string, taskId: string) {
    try {
      // Verificar si el usuario existe
      const user = await this.verifyUser(userId);

      // Definir los criterios de búsqueda según el rol del usuario
      const filter = user.role.includes("ADMIN_ROLE")
        ? { _id: taskId }
        : { _id: taskId, assigningTo: user._id };

      // Buscar la tarea según los criterios definidos y popular las referencias
      const work = await WorkModel.findOne(filter)
        .populate("project")
        .populate("assigningTo");

      if (!work) {
        throw CustomError.notFound("Task not found");
      }

      // Retornar la tarea formateada
      return { task: WorkEntity.fromObject(work) };
    } catch (error) {
      throw CustomError.internal(`Error getting task: ${error}`);
    }
  }

  public async updateTask(
    userId: string,
    taskId: string,
    updateWorkDto: UpdateWorkDto
  ) {
    try {
      await this.verifyUser(userId, "ADMIN_ROLE");

      const work = await WorkModel.findById(taskId)
        .populate("project")
        .populate("assigningTo");

      if (!work) {
        throw CustomError.notFound("Task not found");
      }

      work.title = updateWorkDto.title || work.title;
      work.desc = updateWorkDto.desc || work.desc;

      await work.save();
      return { task: WorkEntity.fromObject(work) };
    } catch (error) {
      throw CustomError.internal(`Error updating task: ${error}`);
    }
  }

  public async reassingTask(
    userId: string,
    taskId: string,
    updateWorkDto: UpdateWorkDto
  ) {
    try {
      await this.verifyUser(userId, "ADMIN_ROLE");

      const work = await WorkModel.findById(taskId)
        .populate("project")
        .populate("assigningTo");

      if (!work) {
        throw CustomError.notFound("Task not found");
      }

      const assigningTo = await UserModel.findById(updateWorkDto.assigningTo);

      if (!assigningTo) {
        throw CustomError.notFound("User to assign not found");
      }

      work.assigningTo = assigningTo._id;

      await work.save();

      return { task: WorkEntity.fromObject(work) };
    } catch (error) {
      throw CustomError.internal(`Error reassigning task: ${error}`);
    }
  }

  public async changeTaskStatus(
    userId: string,
    taskId: string,
    updateWorkDto: UpdateWorkDto
  ) {
    try {
      const user = await this.verifyUser(userId);

      // Definir los criterios de búsqueda según el rol del usuario
      const filter = user.role.includes("ADMIN_ROLE")
        ? { _id: taskId }
        : { _id: taskId, assigningTo: user._id };

      const work = await WorkModel.findById(filter)
        .populate("project")
        .populate("assigningTo");

      if (!work) {
        throw CustomError.notFound("Task not found");
      }

      work.status = updateWorkDto.status || work.status;

      await work.save();

      return { task: WorkEntity.fromObject(work) };
    } catch (error) {
      throw CustomError.internal(`Error changing task status: ${error}`);
    }
  }

  public async changeTaskPriority(
    userId: string,
    taskId: string,
    updateWorkDto: UpdateWorkDto
  ) {
    try {
      await this.verifyUser(userId, "ADMIN_ROLE");

      const work = await WorkModel.findById(taskId)
        .populate("project")
        .populate("assigningTo");

      if (!work) {
        throw CustomError.notFound("Task not found");
      }

      work.priority = updateWorkDto.priority || work.priority;

      await work.save();

      return { task: WorkEntity.fromObject(work) };
    } catch (error) {
      throw CustomError.internal(`Error changing task priority: ${error}`);
    }
  }

  public async changeTaskLimitDate(
    userId: string,
    taskId: string,
    updateWorkDto: UpdateWorkDto
  ) {
    try {
      await this.verifyUser(userId, "ADMIN_ROLE");

      const work = (await WorkModel.findById(taskId)
        .populate("project")
        .populate("assigningTo")) as any;

      if (!work) {
        throw CustomError.notFound("Task not found");
      }

      const now = new Date();
      const limit = new Date(updateWorkDto.limitDate || work.limitDate);

      if (limit < now) {
        throw CustomError.badRequest(
          "Limit date must be greater than the current date"
        );
      }

      if (limit > work.project.limitDate) {
        throw CustomError.badRequest(
          "Limit date must not exceed the project's limit date"
        );
      }

      work.limitDate = limit;

      await work.save();

      return { task: WorkEntity.fromObject(work) };
    } catch (error) {
      throw CustomError.internal(`Error changing task limit date: ${error}`);
    }
  }

  public async deleteTask(userId: string, taskId: string) {
    try {
      await this.verifyUser(userId, "ADMIN_ROLE");

      const work = await WorkModel.findById(taskId);

      if (!work) {
        throw CustomError.notFound("Task not found");
      }

      await WorkModel.findByIdAndDelete(work._id);

      return { task: WorkEntity.fromObject(work) };
    } catch (error) {
      throw CustomError.internal(`Error deleting task: ${error}`);
    }
  }
}
