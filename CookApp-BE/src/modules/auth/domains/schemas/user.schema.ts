import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractSchema } from "base/schemas/schema.base";
import { Exclude, Type } from "class-transformer";
import { Document } from "mongoose";
import { UserProfile, UserProfileSchema } from "./user_profile.schema";

export type UserDocument = User & Document;

@Schema()
export class User extends AbstractSchema {

  @Prop({uniques: true, name: 'user_name'})
  username: string;

  @Prop()
  @Exclude()
  password: string;

  @Prop({unique: true})
  email: string;

  @Prop({unique: true})
  phone: string;

  @Prop()
  avatar: string;

  @Prop()
  displayName: string;

  @Prop({ type: UserProfileSchema})
  @Type(() => UserProfile)
  profile: UserProfile
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserModel: ModelDefinition = {
    name: User.name,
    schema: UserSchema,
    collection: 'users'
}


