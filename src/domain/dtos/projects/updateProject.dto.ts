import { Validation } from "../../../config";

export class UpdateProjectDto {
  constructor(
    public name?: string,
    public desc?: string,
    public members?: string[],
    public memberid?: string,
    public status?:
      | "Beign"
      | "In Progress"
      | "Completed"
      | "Archived"
      | "Cancelled",
    public limitDate?: Date
  ) {}

  static update(object: { [key: string]: any }): [string?, UpdateProjectDto?] {
    const validation = new Validation();
    const { name, desc, members, memberid, status, limitDate } = object;

    if (name) {
      const nameVali = validation.strings(name);
      if (nameVali.error) return [nameVali.error.message];
    }

    if (desc) {
      const descVali = validation.strings(desc);
      if (descVali.error) return [descVali.error.message];
    }

    if (members) {
      const membersVali = validation.arrays(members);
      if (membersVali.error) return [membersVali.error.message];
    }

    if (memberid) {
      const memberidVali = validation.strings(memberid);
      if (memberidVali.error) return [memberidVali.error.message];
    }

    if (status) {
      const statusVali = validation.enums(status, [
        "Beign",
        "In Progress",
        "Completed",
        "Archived",
        "Cancelled",
      ]);
      if (statusVali.error) return [statusVali.error.message];
    }

    if (limitDate) {
      const limitDateVali = validation.dates(limitDate);
      if (limitDateVali.error) return [limitDateVali.error.message];
    }

    return [
      undefined,
      new UpdateProjectDto(name, desc, members, memberid, status, limitDate),
    ];
  }
}
