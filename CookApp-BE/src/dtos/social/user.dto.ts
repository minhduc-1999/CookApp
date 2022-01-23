import { AuditDTO } from "base/dtos/audit.dto";
import { ExternalProvider } from "enums/externalProvider.enum";
import { ProfileDTO } from "./profile.dto";

class Provider {
  type: ExternalProvider;
  id: string;
}

export class UserDTO extends AuditDTO {
  username: string;

  password?: string;

  email: string;

  phone?: string;

  avatar?: string;

  profile?: ProfileDTO;

  displayName?: string;

  externalProvider?: Provider;

  emailVerified: boolean;

  constructor(user?: Partial<UserDTO>) {
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
