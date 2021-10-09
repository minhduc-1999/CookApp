import { Exclude } from "class-transformer";
import _ = require("lodash");

export class AuditDTO {
  id: string;

  @Exclude()
  createdBy: string;

  updatedAt: number;

  @Exclude()
  updatedBy: string;

  @Exclude()
  deletedAt: number;

  @Exclude()
  deletedBy: string;

  constructor(audit: Partial<AuditDTO>) {
    this.createdBy = audit?.createdBy ? audit.createdBy : "system";
    this.updatedAt = audit.updatedAt ? audit.updatedAt : _.now()
    this.updatedBy = audit?.updatedBy ? audit.createdBy : "system";
    this.deletedAt = audit.deletedAt;
    this.deletedBy = audit.deletedBy;
  }
}
