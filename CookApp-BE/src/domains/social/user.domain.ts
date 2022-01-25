import { ApiProperty, ApiPropertyOptional, ApiResponseProperty } from "@nestjs/swagger";
import { Audit } from "domains/audit.domain";
import { ExternalProvider } from "enums/externalProvider.enum";
import { Profile } from "./profile.domain";

class Provider {
  type: ExternalProvider;
  id: string;
}

export class User extends Audit {
  @ApiProperty({ type: String })
  username: string;

  password?: string;

  @ApiProperty({ type: String })
  email: string;

  @ApiPropertyOptional({ type: String })
  phone?: string;

  @ApiPropertyOptional({ type: String })
  avatar?: string;

  @ApiPropertyOptional({ type: Profile })
  profile?: Profile;

  @ApiPropertyOptional({ type: String })
  displayName?: string;

  externalProvider?: Provider;

  @ApiResponseProperty({type: Boolean})
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
