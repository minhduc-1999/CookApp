import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractSchema } from "base/schemas/schema.base";
import { Type } from "class-transformer";
import { ProfileDTO } from "dtos/social/profile.dto";
import { UserDTO } from "dtos/social/user.dto";
import { Document } from "mongoose";
import { UserProfile, UserProfileSchema } from "./user_profile.schema";

export type UserDocument = User & Document;

@Schema()
export class User extends AbstractSchema {
  _id: string;

  @Prop({ uniques: true })
  username: string;

  @Prop()
  password: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  phone?: string;

  @Prop()
  avatar?: string;

  @Prop({ schemaName: "display_name" })
  displayName?: string;

  @Prop({
    type: UserProfileSchema,
    get: (profile: UserProfile) => new ProfileDTO(profile),
  })
  @Type(() => UserProfile)
  profile?: UserProfile;

  constructor(userDto: Partial<UserDTO>) {
    super(userDto);
    this.username = userDto?.username;
    this.email = userDto?.email;
    this.phone = userDto?.phone;
    this.avatar = userDto?.avatar;
    this.profile = userDto?.profile && new UserProfile(userDto?.profile);
    this.password = userDto?.password;
    this._id = userDto?.id;
    this.displayName = userDto?.displayName;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserModel: ModelDefinition = {
  name: User.name,
  schema: UserSchema,
  collection: "users",
};
