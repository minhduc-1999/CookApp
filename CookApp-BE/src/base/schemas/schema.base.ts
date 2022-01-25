import { Prop } from "@nestjs/mongoose";
import { Audit } from "domains/audit.domain";

export abstract class AbstractSchema {
  id: string;

  @Prop({ schemaName: "updated_at", required: true })
  updatedAt: number;

  @Prop({ schemaName: "created_at", required: true })
  createdAt: number;

  @Prop({ schemaName: "updated_by", required: true })
  updatedBy: string;

  @Prop({ schemaName: "deleted_at" })
  deletedAt: number;

  @Prop({ schemaName: "deleted_by" })
  deletedBy: string;

  constructor(audit: Partial<Audit>) {
    this.updatedAt = audit?.updatedAt;
    this.createdAt = audit?.createdAt;
    this.updatedBy = audit?.updatedBy;
    this.deletedAt = audit?.deletedAt;
    this.deletedBy = audit?.deletedBy;
  }
}
