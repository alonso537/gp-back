import { ProjectModel, UserModel } from "../../data/index.ts";
import { CreateProjectDto, CustomError, ProjectEntity } from "../../domain";
import { UpdateProjectDto } from "../../domain/dtos/projects/updateProject.dto.js";

export class ProjectService {
  //DI - Dependency Injection
  constructor() {}

  public async createProject(
    createProjectDto: CreateProjectDto,
    userId: string
  ) {
    try {
      const { name, desc, limitDate } = createProjectDto;

      // Convertir y verificar fechas de entrada
      const now = new Date();
      const limit = new Date(limitDate);

      if (limit < now) {
        throw CustomError.badRequest("Limit date must be greater than now");
      }

      if (limit < new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30)) {
        throw CustomError.badRequest("Limit date must be greater than 30 days");
      }

      // Verificar existencia de proyecto con mismo nombre
      if (await ProjectModel.findOne({ name })) {
        throw CustomError.badRequest("Project already exists");
      }

      // Validar existencia del creador del proyecto
      const creatorUser = await UserModel.findById(userId);
      if (!creatorUser) {
        throw CustomError.notFound("Creator user not found");
      }

      //verificar si el usuario es administrador
      if (!creatorUser.role.includes("ADMIN_ROLE")) {
        throw CustomError.forbidden("User is not an admin");
      }

      // Crear instancia del proyecto y asignar datos
      const project = new ProjectModel({
        name,
        desc,
        owner: creatorUser._id,
        limitDate,
        members: [creatorUser._id], // Agregar al creador directamente como miembro
      });

      // Guardar proyecto en la base de datos
      await project.save();

      // Retornar datos formateados del proyecto
      return { project: ProjectEntity.fromObject(project) };
    } catch (error) {
      throw CustomError.internal(`Error creating project: ${error}`);
    }
  }

  public async getProjects(userId: string) {
    try {
      const projects = await ProjectModel.find({ members: userId })
        .populate("members")
        .sort({ createdAt: -1 });

      return projects.map((project) => ProjectEntity.fromObject(project));
    } catch (error) {
      throw CustomError.internal(`Error getting projects: ${error}`);
    }
  }

  public async getProject(userId: string, id: string) {
    try {
      const project = await ProjectModel.findOne({
        _id: id,
        members: userId,
      }).populate("members");

      if (!project) {
        throw CustomError.notFound("Project not found");
      }

      return ProjectEntity.fromObject(project);
    } catch (error) {
      throw CustomError.internal(`Error getting project: ${error}`);
    }
  }

  public async updateProject(
    userId: string,
    id: string,
    updateProjectDto: UpdateProjectDto
  ) {
    try {
      //obtener usuario que realiza la peticion
      const user = await UserModel.findById(userId);

      //verificar si existe
      if (!user) {
        throw CustomError.notFound("User not found");
      }
      //verificar si el usuario es administrador
      if (!user.role.includes("ADMIN_ROLE")) {
        throw CustomError.forbidden("User is not an admin");
      }

      //verificar si el proyecto existe
      const project = await ProjectModel.findById(id);

      if (!project) {
        throw CustomError.notFound("Project not found");
      }

      //actualizar proyecto
      await ProjectModel.findByIdAndUpdate(id, updateProjectDto);

      //retornar proyecto actualizado
      return ProjectEntity.fromObject(project);
    } catch (error) {
      console.log(error);

      throw CustomError.internal(`Error updating project: ${error}`);
    }
  }

  public async addMembers(userId: string, id: string, updateProjectDto: UpdateProjectDto) {
    try {
      // Validar que el usuario que realiza la operación existe y tiene permisos
      const user = await UserModel.findById(userId);
      if (!user) {
        throw CustomError.notFound("User not found");
      }
      if (!user.role.includes("ADMIN_ROLE")) {
        throw CustomError.forbidden("User is not an admin");
      }

      // Verificar que el proyecto existe
      const project = await ProjectModel.findById(id);
      if (!project) {
        throw CustomError.notFound("Project not found");
      }

      // Inicializar lista de errores y procesar miembros en lote
      const errors: string[] = [];
      const newMembers = [];

      for (const memberId of updateProjectDto.members!) {
        const member = await UserModel.findById(memberId);

        if (!member) {
          errors.push(`Member with ID ${memberId} not found`);
          continue;
        }

        if (project.members.includes(member._id)) {
          errors.push(
            `Member with ID ${memberId} already exists in the project`
          );
          continue;
        }

        // Agregar miembro si no hay problemas
        newMembers.push(member._id);
      }

      // Agregar nuevos miembros al proyecto si hay alguno válido
      if (newMembers.length > 0) {
        project.members.push(...newMembers);
        await project.save();
      }

      // Manejar errores, si los hubo
      if (errors.length > 0) {
        throw CustomError.badRequest(errors.join("; "));
      }

      // Retornar el proyecto actualizado
      return ProjectEntity.fromObject(project);
    } catch (error) {
      throw CustomError.internal(`Error adding members: ${error}`);
    }
  }

  public async removeMembers(userId: string, id: string, updateProjectDto: UpdateProjectDto) {
    try {
      // Validar que el usuario que realiza la operación existe y tiene permisos
      const user = await UserModel.findById(userId);
      if (!user) {
        throw CustomError.notFound("User not found");
      }
      if (!user.role.includes("ADMIN_ROLE")) {
        throw CustomError.forbidden("User is not an admin");
      }

      // Verificar que el proyecto existe
      const project = await ProjectModel.findById(id);
      if (!project) {
        throw CustomError.notFound("Project not found");
      }

      // Inicializar lista de errores y procesar miembros en lote
      const errors: string[] = [];

      const member = await UserModel.findById(updateProjectDto.memberid!);

      if (!member) {
        errors.push(`Member with ID ${updateProjectDto.memberid!} not found`);
      }

      if (!project.members.includes(member!._id)) {
        errors.push(`Member with ID ${updateProjectDto.memberid!} does not exist in the project`);
      }

      // Eliminar miembro si no hay problemas
      project.members = project.members.filter(
        (m) => m.toString() !== updateProjectDto.memberid!
      );

      await project.save();

      // Manejar errores, si los hubo
      if (errors.length > 0) {
        throw CustomError.badRequest(errors.join("; "));
      }

      // Retornar el proyecto actualizado
      return ProjectEntity.fromObject(project);
    } catch (error) {
      throw CustomError.internal(`Error removing members: ${error}`);
    }
  }

  public async changeStatus(userId: string, id: string, updateProjectDto: UpdateProjectDto) {
    try {
      // Validar que el usuario que realiza la operación existe y tiene permisos
      const user = await UserModel.findById(userId);
      if (!user) {
        throw CustomError.notFound("User not found");
      }
      if (!user.role.includes("ADMIN_ROLE")) {
        throw CustomError.forbidden("User is not an admin");
      }

      // Verificar que el proyecto existe
      const project = await ProjectModel.findById(id);
      if (!project) {
        throw CustomError.notFound("Project not found");
      }

      // Actualizar estado del proyecto
      project.status = updateProjectDto.status!;
      await project.save();

      // Retornar el proyecto actualizado
      return ProjectEntity.fromObject(project);
    } catch (error) {
      throw CustomError.internal(`Error changing status: ${error}`);
    }
  }

  public async changeLimitDate(userId: string, id: string, updateProjectDto: UpdateProjectDto) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw CustomError.notFound("User not found");
      }
      if (!user.role.includes("ADMIN_ROLE")) {
        throw CustomError.forbidden("User is not an admin");
      }

      const project = await ProjectModel.findById(id);

      if (!project) {
        throw CustomError.notFound("Project not found");
      }

      const now = new Date();
      const limit = new Date(updateProjectDto.limitDate!);

      if (limit < now) {
        throw CustomError.badRequest("Limit date must be greater than now");
      }

      if (limit < new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30)) {
        throw CustomError.badRequest("Limit date must be greater than 30 days");
      }

      project.limitDate = limit;
      await project.save();

      return ProjectEntity.fromObject(project);
    } catch (error) {
      throw CustomError.internal(`Error changing limit date: ${error}`);
    }
  }

  public async deleteProject(userId: string, id: string) {
    try {
      const user = await UserModel.findById(userId);
      if(!user) {
        throw CustomError.notFound("User not found");
      }
      if(!user.role.includes("ADMIN_ROLE")) {
        throw CustomError.forbidden("User is not an admin");
      }

      const project = await ProjectModel.findById(id);

      if(!project) {
        throw CustomError.notFound("Project not found");
      }

      await ProjectModel.findByIdAndDelete(project._id);

      return { message: "Project deleted successfully" };

    } catch (error) {
      throw CustomError.internal(`Error deleting project: ${error}`);
    }
  }
}
