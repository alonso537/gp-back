import { Validation } from "../../../config";

export class UpdateWorkDto {
  constructor(
    public title?: string,
    public desc?: string,
    public assigningTo?: string,
    public limitDate?: Date,
    public priority?: "LOW" | "MEDIUM" | "HIGH",
    public status?:
      | "PENDING"
      | "IN_PROGRESS"
      | "CHEKING"
      | "COMPLETED"
      | "CANCELED"
  ) {}

  static create(object: { [key: string]: any }): [string?, UpdateWorkDto?] {
    const validation = new Validation();
    const { title, desc, assigningTo, limitDate, priority, status } = object;

    if (title) {
      const titleVali = validation.strings(title);
      if (titleVali.error) return [titleVali.error.message];
    }

    if (desc) {
      const descVali = validation.strings(desc);
      if (descVali.error) return [descVali.error.message];
    }

    if (assigningTo) {
      const assigningToVali = validation.strings(assigningTo);
      if (assigningToVali.error) return [assigningToVali.error.message];
    }

    if (limitDate) {
      const limitDateVali = validation.dates(limitDate);
      if (limitDateVali.error) return [limitDateVali.error.message];
    }

    if (priority) {
      const priorityVali = validation.enums(priority, [
        "LOW",
        "MEDIUM",
        "HIGH",
      ]);
      if (priorityVali.error) return [priorityVali.error.message];
    }

    if (status) {
      const statusVali = validation.enums(status, [
        "PENDING",
        "IN_PROGRESS",
        "CHEKING",
        "COMPLETED",
        "CANCELED",
      ]);
      if (statusVali.error) return [statusVali.error.message];
    }

    return [
      undefined,
      new UpdateWorkDto(title, desc, assigningTo, limitDate, priority, status),
    ];
  }
}
