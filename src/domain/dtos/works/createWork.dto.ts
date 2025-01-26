import { Validation } from "../../../config";

export class CreateWorkDto {
  constructor(
    public title: string,
    public desc: string,
    public project: string,
    public assigningTo: string,
    public limitDate: Date,
    public priority?: string
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateWorkDto?] {
    const validation = new Validation();
    const { title, desc, project, assigningTo, limitDate, priority } = object;

    if (!title) return ["Missing title"];

    const titleVali = validation.strings(title);

    if (titleVali.error) return [titleVali.error.message];

    if (!desc) return ["Missing description"];

    const descVali = validation.strings(desc);

    if (descVali.error) return [descVali.error.message];

    if (!project) return ["Missing project"];

    const projectVali = validation.strings(project);

    if (projectVali.error) return [projectVali.error.message];

    if (!assigningTo) return ["Missing assigningTo"];

    const assigningToVali = validation.strings(assigningTo);

    if (assigningToVali.error) return [assigningToVali.error.message];

    if (!limitDate) return ["Missing limit date"];

    const limitDateVali = validation.dates(limitDate);

    if (limitDateVali.error) return [limitDateVali.error.message];

    return [
      undefined,
      new CreateWorkDto(title, desc, project, assigningTo, limitDate, priority),
    ];
  }
}
