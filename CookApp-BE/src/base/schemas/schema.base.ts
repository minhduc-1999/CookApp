import { Prop } from "@nestjs/mongoose";
import { Audit } from "domains/audit.domain";

export abstract class AbstractSchema {
  @Prop()
  _id: string;

  @Prop()
  updatedAt: number;

  @Prop({required: true })
  createdAt: number;

  @Prop()
  updatedBy: string;

  @Prop()
  deletedAt: number;

  @Prop()
  deletedBy: string;

  constructor(audit: Partial<Audit>) {
    this.updatedAt = audit?.updatedAt;
    this.createdAt = audit?.createdAt;
    this.updatedBy = audit?.updatedBy;
    this.deletedAt = audit?.deletedAt;
    this.deletedBy = audit?.deletedBy;
  }
}
