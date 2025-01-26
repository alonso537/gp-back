import { NextFunction, Request, Response } from "express";
import { jwtAdapter } from "../../config/adapters/jwt.adapter";
import { CustomError } from "../../domain";
import { UserModel } from "../../data/mongo/models/user.model";
import { UserEntity } from "../../domain/entities/user.entity";
import { envs } from "../../config/envs";

export const authMiddleware = {
   authenticate: async (req: Request | any, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw CustomError.unauthorized("Token not provided");
    }

    // console.log(token);
    

    try {
    //   validamos el token
      const payload = jwtAdapter.verify(token, envs.JWT_SECRET) as any;

      if (!payload) {
        throw CustomError.unauthorized("Invalid token");
      }

      const {id} = payload;

    //   console.log(id);

      const user = await  UserModel.findById(id);

    //   console.log(user);
      

        if (!user) {
            throw CustomError.unauthorized("Invalid token");
        }

        req.user = UserEntity.fromObject(user);

        next();

    } catch (error) {
      throw CustomError.unauthorized("Invalid token 1");
    }
  },
};
