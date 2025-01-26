import { Validation } from "../../../config";
import { regularExp } from "../../../config/regular-exp";

export class RegisterUserDto {
  private constructor(
    public name: string,
    public email: string,
    public password: string
  ) {}

  static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
    const validation = new Validation();
    const { name, email, password } = object;

    if (!name) return ["Missing name"];

    const nameVali = validation.strings(name);

    if (nameVali.error) return [nameVali.error.message];

    if (!email) return ["Missing email"];

    const emailVali = validation.emails(email);

    if (emailVali.error) return [emailVali.error.message];

    if (!password) return ["Missing password"];

    const passwordVali = validation.passwords(password);

    if (passwordVali.error) return [passwordVali.error.message];

    return [undefined, new RegisterUserDto(name, email, password)];
  }
}
