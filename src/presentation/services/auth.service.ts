import { bcryptAdapter, envs, jwtAdapter } from "../../config";
import { UserModel } from "../../data/mongo/models";
import {
  CustomError,
  RegisterUserDto,
  LoginUserDto,
  UserEntity,
  UpdateUserDto,
} from "../../domain";

export class AuthService {
  //Di - Dependency Injection
  constructor() {}

  public async registerUser(registerDto: RegisterUserDto) {
    //verificamos si ya existe un usuario con el email o nombre
    const exist = await UserModel.findOne({
      $or: [{ email: registerDto.email }, { name: registerDto.name }],
    });

    if (exist) {
      throw CustomError.badRequest("User already exists");
    }

    try {
      const user = new UserModel(registerDto);

      //encriptamos la contraseña
      user.password = bcryptAdapter.hash(user.password);

      //guardamos el usuario
      await user.save();

      const { password, ...rest } = UserEntity.fromObject(user);

      return { user: rest };
    } catch (error) {
      throw CustomError.internal(`Error creating user: ${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    //verificamos que el usuario exista
    const exist = await UserModel.findOne({ email: loginUserDto.email });

    if (!exist) {
      throw CustomError.notFound("User not found");
    }

    try {
      //comparamos la contraseña
      const isValid = bcryptAdapter.compare(
        loginUserDto.password,
        exist.password
      );

      if (!isValid) {
        throw CustomError.badRequest("Invalid password");
      }

      const user = UserEntity.fromObject(exist);

      //generamos el token
      const token = jwtAdapter.sign({ id: user.id }, envs.JWT_SECRET, "30d");

      const { password, ...rest } = UserEntity.fromObject(user);

      return { user: rest, token };
    } catch (error) {
      throw CustomError.internal(`Error login user: ${error}`);
    }
  }

  public async getUser(userId: string) {
    //verificamos que el usuario exista
    const exist = await UserModel.findById(userId);

    if (!exist) {
      throw CustomError.notFound("User not found");
    }

    try {
      const { password, ...rest } = UserEntity.fromObject(exist);

      return { user: rest };
    } catch (error) {
      throw CustomError.internal(`Error getting user: ${error}`);
    }
  }

  public async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await UserModel.findById(userId);

      if (!user) {
        throw CustomError.notFound("User not found");
      }

      //actualizamos los datos
      user.name = updateUserDto.name || user.name;
      user.email = updateUserDto.email || user.email;
      user.password = updateUserDto.password
        ? bcryptAdapter.hash(updateUserDto.password)
        : user.password;

      await user.save();

      const { password, ...rest } = UserEntity.fromObject(user);

      return { user: rest };
    } catch (error) {
      throw CustomError.internal(`Error updating user: ${error}`);
    }
  }

  public async ChangeRole(
    userId: string,
    userChange: string,
    updateUserDto: UpdateUserDto
  ) {
    try {
      const user = await UserModel.findById(userId);

      if (!user) {
        throw CustomError.notFound("User not found");
      }

      if (!user.role.includes("ADMIN_ROLE")) {
        throw CustomError.unauthorized("You are not an administrator");
      }

      const userChangeDb = await UserModel.findById(userChange);

      if (!userChangeDb) {
        throw CustomError.notFound("User not found");
      }

      //actualizamos el rol

      userChangeDb.role = updateUserDto.role
        ? [updateUserDto.role]
        : userChangeDb.role;

      await user.save();

      const { password, ...rest } = UserEntity.fromObject(userChangeDb);

      return { user: rest };
    } catch (error) {
      throw CustomError.internal(`Error changing role: ${error}`);
    }
  }
}
