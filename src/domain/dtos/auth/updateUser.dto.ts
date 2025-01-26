import { Validation } from "../../../config";

export class UpdateUserDto {
  constructor(
    public name?: string,
    public email?: string,
    public password?: string,
    public role?: "ADMIN_ROLE" | "USER_ROLE"
  ) {}

  static update(object: { [key: string]: any }): [string?, UpdateUserDto?] {
    const validate = new Validation();
    const { name, email, password, role } = object;

    if (name) {
      const nameVali = validate.strings(name);
      if (nameVali.error) return [nameVali.error.message];
    }

    if (email) {
      const emailVali = validate.emails(email);
      if (emailVali.error) return [emailVali.error.message];
    }

    if (password) {
      const passwordVali = validate.passwords(password);
      if (passwordVali.error) return [passwordVali.error.message];
    }

    if (role) {
      const roleVali = validate.enums(role, ["ADMIN_ROLE", "USER_ROLE"]);
      if (roleVali.error) return [roleVali.error.message];
    }

    return [undefined, new UpdateUserDto(name, email, password, role)];
  }
}
