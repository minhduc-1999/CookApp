import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractSchema } from "base/schemas/schema.base";
import { Exclude, Expose, Type } from "class-transformer";
import { Document } from "mongoose";
import { UserProfile, UserProfileSchema } from "./user_profile.schema";

export type UserDocument = User & Document;

@Schema()
@Exclude()
export class User extends AbstractSchema {

  @Prop({uniques: true, name: 'user_name'})
  @Expose()
  username: string;

  @Prop()
  password: string;

  @Prop({unique: true})
  @Expose()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  avatar: string;

  @Prop()
  @Expose()
  displayName: string;

  @Prop({ type: UserProfileSchema})
  @Type(() => UserProfile)
  @Expose()
  profile: UserProfile
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserModel: ModelDefinition = {
    name: User.name,
    schema: UserSchema,
    collection: 'users'
}


