import { ApiProperty } from "@nestjs/swagger";
import { AuditDTO } from "base/dtos/audix.dto";
import { Exclude, Type } from "class-transformer";
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from "class-validator";
import { ProfileDTO } from "./profile.dto";

export class UserDTO extends AuditDTO {
  @IsNotEmpty()
  @ApiProperty({ type: String })
  @IsString()
  username: string;

  @Exclude({ toPlainOnly: true })
  password: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber("VN")
  phone: string;

  @IsString()
  avatar: string;

  @Type(() => ProfileDTO)
  profile: ProfileDTO;

  @IsMongoId()
  id: string;

  constructor(user: Partial<UserDTO>) {
    super(user);
    this.id = user?.id;
    this.username = user?.username;
    this.email = user?.email;
    this.phone = user?.phone;
    this.avatar = user?.avatar;
    this.profile = user?.profile;
    this.password = user?.password;
  }
}
