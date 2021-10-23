import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import _ = require("lodash");

export class AuditDTO {
  @ApiProperty({type: String, readOnly: true})
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
    this.createdBy = audit?.createdBy;
    this.updatedAt = audit?.updatedAt;
    this.updatedBy = audit?.updatedBy;
    this.deletedAt = audit?.deletedAt;
    this.deletedBy = audit?.deletedBy;
  }
}
