import { Audit } from "domains/audit.domain";
import { ExternalProvider } from "enums/externalProvider.enum";
import { Media } from "./media.domain";
import { Profile } from "./profile.domain";

class Provider {
  type: ExternalProvider;
  id: string;
}

export class User extends Audit {
  username: string;

  password?: string;

  email: string;

  phone?: string;

  avatar?: Media;

  profile?: Profile;

  displayName?: string;

  externalProvider?: Provider;

  emailVerified: boolean;

  constructor(user?: Partial<User>) {
    super(user)
    this.username = user?.username
    this.email = user?.email 
    this.phone = user?.phone
    this.avatar = user?.avatar
    this.profile = user?.profile
    this.password = user?.password
    this.displayName = user?.displayName
    this.externalProvider = user?.externalProvider
    this.emailVerified = user?.emailVerified
  }
}
