import { Request, Response } from "express";
import { CustomError, RegisterUserDto, UpdateUserDto } from "../../domain";
import { AuthService } from "../services/auth.service";
import { LoginUserDto } from "../../domain/dtos/auth/loginuser.dto";

export class AuthController {
  //DI - Dependency Injection
  constructor(public readonly authService: AuthService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`Error: ${error}`);

    return res.status(500).json({ error: "Internal Server Error" });
  };

  register = (req: Request, res: Response | any) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    this.authService
      .registerUser(registerUserDto!)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  login = (req: Request, res: Response | any) => {
    const [error, loginUSerDto] = LoginUserDto.login(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    this.authService
      .loginUser(loginUSerDto!)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  getUser = (req: Request | any, res: Response | any) => {
    console.log(req.user);

    if (!req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    this.authService
      .getUser(req.user.id)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  updateUser = (req: Request | any, res: Response | any) => {
    const [error, updateUserDto] = UpdateUserDto.update(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    this.authService
      .updateUser(req.user.id, updateUserDto!)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  changeRole = (req: Request | any, res: Response | any) => {
    const [error, updateUserDto] = UpdateUserDto.update(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    this.authService
      .ChangeRole(req.user.id, req.params.id, updateUserDto!)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };
}
