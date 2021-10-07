import { User } from "../domains/schemas/user.schema";
import { UserProfile } from "../domains/schemas/user_profile.schema";

export class UserDTO {
  id: string;

  username: string;

  email: string;

  phone: string;

  avatar: string;

  displayName: string;

  profile: UserProfile;

  constructor(user: Partial<User>) {
    if (user.id) this.id = user.id;
    if (user.username) this.username = user.username;
    if (user.email) this.email = user.email;
    if (user.phone) this.phone = user.phone;
    if (user.avatar) this.avatar = user.avatar;
    if (user.displayName) this.displayName = user.displayName;
    if (user.profile) this.profile = user.profile;
  }
}
