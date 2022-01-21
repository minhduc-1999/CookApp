import { AbstractSchema } from "base/schemas/schema.base";
import { Type } from "class-transformer";
import { UserDTO } from "dtos/social/user.dto";
import { ExternalProvider } from "enums/externalProvider.enum";
import { UserProfile } from "./user-profile.entity";

export type UserDocument = User & Document;

class Provider {
  type: ExternalProvider;
  id: string;
}

export class User extends AbstractSchema {
  _id: string;

  username: string;

  password?: string;

  email: string;

  phone?: string;

  avatar?: string;

  displayName?: string;

  @Type(() => UserProfile)
  profile?: UserProfile;

  @Type(() => Provider)
  externalProvider?: Provider;

  emailVerified: boolean;

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
    this.externalProvider = userDto?.externalProvider;
    this.emailVerified = userDto?.emailVerified;
  }
}
