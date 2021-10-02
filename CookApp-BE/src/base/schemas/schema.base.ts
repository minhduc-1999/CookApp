import { Prop } from "@nestjs/mongoose";
import { Exclude } from "class-transformer";

export abstract class AbstractSchema {
  @Prop()
  @Exclude()
  createdBy: string;

  @Prop()
  @Exclude()
  updatedAt: Date;

  @Prop()
  @Exclude()
  updatedBy: string;

  @Prop()
  @Exclude()
  deletedAt: Date;

  @Prop()
  @Exclude()
  deletedBy: string;
}
