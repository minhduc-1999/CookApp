import _ = require("lodash");

export class AuditDTO {
  id: string;

  createdAt: number;

  updatedAt: number;

  updatedBy: string;

  deletedAt?: number;

  deletedBy?: string;

  constructor() {
    this.createdAt = _.now()
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
