import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "domains/social/user.domain";

export type UserDocument = UserItem & Document;

@Schema()
export class UserItem {
  @Prop()
  _id: string;

  @Prop()
  displayName: string;

  @Prop()
  email: string;

  getUpdateData(): Partial<UserItem> {
    const { _id, ...rest } = this;
    return rest;
  }

  constructor(user: User) {
    this._id = user.id;
    this.displayName = user?.displayName;
    this.email = user?.account?.email;
  }
}

export const UserSchema = SchemaFactory.createForClass(UserItem);

UserSchema.index({ displayName: "text", email: "text" });

export const UserModel: ModelDefinition = {
  name: UserItem.name,
  schema: UserSchema,
  collection: "users",
};
