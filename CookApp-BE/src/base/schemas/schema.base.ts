import { Prop } from "@nestjs/mongoose";
import { Exclude } from "class-transformer";

export abstract class AbstractSchema {

  @Prop({ name: "created_by" })
  @Exclude()
  createdBy: string;

  @Prop({ name: "updated_at" })
  @Exclude()
  updatedAt: Date;

  @Prop({ name: "updated_by" })
  @Exclude()
  updatedBy: string;

  @Prop({ name: "deleted_at" })
  @Exclude()
  deletedAt: Date;

  @Prop({ name: "deleted_by" })
  @Exclude()
  deletedBy: string;
}
