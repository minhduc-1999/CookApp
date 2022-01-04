import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { AuditDTO } from "base/dtos/audit.dto";
import { Exclude, Expose, Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { ExternalProvider } from "enums/externalProvider.enum";
import { ProfileDTO } from "./profile.dto";

class Provider {
  type: ExternalProvider;
  id: string;
}
export class UserDTO extends AuditDTO {
  @IsNotEmpty()
  @ApiProperty({ type: String })
  @IsString()
  @ApiProperty({ type: String })
  username: string;

  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  password?: string;

  @ApiProperty({ type: String })
  @IsEmail()
  @Expose()
  email: string;

  @ApiPropertyOptional({ type: String })
  @IsPhoneNumber("VN")
  phone?: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @Expose()
  avatar?: string;

  @ApiPropertyOptional({ type: ProfileDTO })
  @Type(() => ProfileDTO)
  @Expose()
  profile?: ProfileDTO;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @Expose()
  displayName?: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  externalProvider?: Provider;

  @Expose()
  emailVerified: boolean;

  static create(
    user: Pick<
      UserDTO,
      | "username"
      | "password"
      | "email"
      | "phone"
      | "avatar"
      | "profile"
      | "displayName"
      | "externalProvider"
    >
  ): UserDTO {
    const newUser = new UserDTO();
    newUser.create("system");
    newUser.username = user?.username;
    newUser.email = user?.email;
    newUser.phone = user?.phone;
    newUser.avatar = user?.avatar;
    newUser.profile = user?.profile;
    newUser.password = user?.password;
    newUser.displayName = user?.displayName;
    newUser.externalProvider = user?.externalProvider;
    newUser.emailVerified = false;
    return newUser;
  }
}
