import { Exclude } from "class-transformer";

export class AuditDTO {
  @Exclude()
  createdBy: string;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  updatedBy: string;

  @Exclude()
  deletedAt: Date;

  @Exclude()
  deletedBy: string;

  constructor(audit: Partial<AuditDTO>) {
      this.createdBy = audit.createdBy
      this.updatedAt = audit.updatedAt
      this.updatedBy = audit.updatedBy
      this.deletedAt = audit.deletedAt
      this.deletedBy = audit.deletedBy
  }
}
