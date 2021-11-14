import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import _ = require("lodash");

export class AuditDTO {
  @ApiProperty({ type: String, readOnly: true })
  id: string;

  @Exclude()
  createdBy: string;

  @Exclude()
  createdAt: number;

  updatedAt: number;

  @Exclude()
  updatedBy: string;

  @Exclude()
  deletedAt: number;

  @Exclude()
  deletedBy: string;

  constructor(audit: Partial<AuditDTO>) {
    this.createdBy = audit?.createdBy;
    this.updatedAt = audit?.updatedAt ? audit?.updatedAt : _.now();
    this.createdAt = audit?.createdAt ? audit?.createdAt : _.now();
    this.updatedBy = audit?.updatedBy;
    this.deletedAt = audit?.deletedAt;
    this.deletedBy = audit?.deletedBy;
  }
}
