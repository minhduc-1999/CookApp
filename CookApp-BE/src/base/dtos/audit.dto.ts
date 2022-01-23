import _ = require("lodash");

export class AuditDTO {
  id: string;

  createdAt: number;

  updatedAt: number;

  updatedBy: string;

  deletedAt?: number;

  deletedBy?: string;

  constructor(audit: Partial<AuditDTO>) {
    this.createdAt = audit.createdAt ?? _.now()
    this.id = audit.id
    this.updatedAt = audit.updatedAt
    this.updatedBy = audit.updatedBy
    this.deletedAt = audit.deletedAt
    this.deletedBy = audit.deletedBy
  }

  update(userId: string) {
    this.updatedBy = userId;
    this.updatedAt = _.now();
  }

  delete(userId: string) {
    this.deletedAt = _.now();
    this.deletedBy = userId;
  }
}
