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
export class Account extends Audit{ 

  username: string;

  password?: string;

  email: string;

  phone?: string;

  externalProvider?: ExternalProvider;

  emailVerified: boolean;

  constructor(account?: Partial<Account>) {
    super(account)
    this.username = account?.username
    this.email = account?.email
    this.phone = account?.phone
    this.password = account?.password
    this.externalProvider = account?.externalProvider
    this.emailVerified = account?.emailVerified
  }
}
