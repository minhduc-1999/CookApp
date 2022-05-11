import { PermisstionType, RoleType } from "../../enums/system.enum";
import { Audit } from "../../domains/audit.domain";
import { ExternalProviderType } from "../../enums/externalProvider.enum";

export class ExternalProvider extends Audit{

  type: ExternalProviderType;

  externalID: string;

  constructor(provider: Partial<ExternalProvider>) {
    super(provider)
    this.type = provider?.type
    this.externalID = provider?.externalID
  }
}

export class Permission extends Audit {
  title: string

  sign: PermisstionType

  constructor(pms: Partial<Permission>) {
    super(pms)
    this.title = pms?.title
    this.sign = pms?.sign
  }
}

export class Role extends Audit {
  title: string

  sign: RoleType

  permissions: Permission[]

  constructor(role: Partial<Role>) {
    super(role)
    this.title = role?.title
    this.sign = role?.sign
    this.permissions = role?.permissions
  }
}

export class Account extends Audit{ 

  username: string;

  password?: string;

  email: string;

  phone?: string;

  externalProvider?: ExternalProvider;

  emailVerified: boolean;

  role: Role

  verify() {
    this.emailVerified = true
  }

  constructor(account?: Partial<Account>) {
    super(account)
    this.username = account?.username
    this.email = account?.email
    this.phone = account?.phone
    this.password = account?.password
    this.externalProvider = account?.externalProvider
    this.emailVerified = account?.emailVerified
    this.role = account?.role
  }
}
