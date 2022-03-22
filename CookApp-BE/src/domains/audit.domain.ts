import _ = require("lodash");

export class Audit {
  id: string;

  createdAt: number;

  updatedAt: number;

  updatedBy: string;

  deletedAt?: number;

  deletedBy?: string;

  constructor(audit: Partial<Audit>) {
    this.createdAt = audit?.createdAt ?? _.now()
    this.id = audit?.id
    this.updatedAt = audit?.updatedAt
    this.updatedBy = audit?.updatedBy
    this.deletedAt = audit?.deletedAt
    this.deletedBy = audit?.deletedBy
  }
}
