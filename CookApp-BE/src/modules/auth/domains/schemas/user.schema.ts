import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  title: string;

  @Prop()
  content: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserModel: ModelDefinition = {
    name: User.name,
    schema: UserSchema
}


