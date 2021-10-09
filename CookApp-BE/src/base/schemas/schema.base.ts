import { Prop } from "@nestjs/mongoose";
import { Exclude } from "class-transformer";

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
}
