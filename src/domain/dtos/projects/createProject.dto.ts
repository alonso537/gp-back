import { Validation } from "../../../config";

export class CreateProjectDto {
  constructor(
    public name: string,
    public desc: string,
    public members: string[],
    public limitDate: Date
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateProjectDto?] {
    const validation = new Validation();
    const { name, desc, members, limitDate } = object;

    if (!name) return ["Missing name"];

    const nameVali = validation.strings(name);

    if (nameVali.error) return [nameVali.error.message];

    if (!desc) return ["Missing description"];

    const descVali = validation.strings(desc);

    if (descVali.error) return [descVali.error.message];

    if (!limitDate) return ["Missing limit date"];

    const limitDateVali = validation.dates(limitDate);

    if (limitDateVali.error) return [limitDateVali.error.message];

    // if(!members) return ['Missing members'];

    return [undefined, new CreateProjectDto(name, desc, members, limitDate)];
  }
}
