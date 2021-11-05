import { Prop } from "@nestjs/mongoose";
import { AuditDTO } from "base/dtos/audit.dto";
import _ = require("lodash");

export abstract class AbstractSchema {
  id: string;

  @Prop({ schemaName: "created_by", required: true })
  createdBy: string;

  @Prop({ schemaName: "updated_at", required: true })
  updatedAt: number;

  @Prop({ schemaName: "updated_by", required: true })
  updatedBy: string;

  @Prop({ schemaName: "deleted_at" })
  deletedAt: number;

  @Prop({ schemaName: "deleted_by" })
  deletedBy: string;

  constructor(audit: Partial<AuditDTO>) {
    this.createdBy = audit?.createdBy ? audit.createdBy : "system";
    this.updatedAt = audit?.updatedAt ? audit.updatedAt : _.now();
    this.updatedBy = audit?.updatedBy ? audit.createdBy : "system";
    this.deletedAt = audit?.deletedAt;
    this.deletedBy = audit?.deletedBy;
  }
}
