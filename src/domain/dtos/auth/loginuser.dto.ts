import { Validation } from "../../../config";

export class LoginUserDto {
  private constructor(public email: string, public password: string) {}

  static login(object: { [key: string]: any }): [string?, LoginUserDto?] {
    const validation = new Validation();
    const { email, password } = object;

    if (!email) return ["Email is required"];

    const emailVali = validation.emails(email);
    if (emailVali.error) return [emailVali.error.message];

    if (!password) return ["Password is required"];

    const passwordVali = validation.passwords(password);

    if (passwordVali.error) return [passwordVali.error.message];

    return [undefined, new LoginUserDto(email, password)];
  }
}
