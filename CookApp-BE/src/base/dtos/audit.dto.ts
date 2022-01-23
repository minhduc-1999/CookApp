import { ApiResponseProperty } from "@nestjs/swagger";
import _ = require("lodash");

export class AuditDTO {
  @ApiResponseProperty({type: String})
  id: string;

  @ApiResponseProperty({type: Number})
  createdAt: number;

  @ApiResponseProperty({type: Number})
  updatedAt: number;

  @ApiResponseProperty({type: String})
  updatedBy: string;

  @ApiResponseProperty({type: Number})
  deletedAt?: number;

  @ApiResponseProperty({type: String})
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
