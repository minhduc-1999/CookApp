import { ApiProperty } from "@nestjs/swagger";
import { AuditDTO } from "base/dtos/audix.dto";
import { Exclude, Type } from "class-transformer";
import { IsEmail, IsMongoId, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { ProfileDTO } from "./profile.dto";

export class UserDTO extends AuditDTO {
  @IsNotEmpty()
  @ApiProperty({ type: Number, default: 170 })
  @IsString()
  username: string;

  @Exclude({toPlainOnly: true})
  password: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('VN')
  phone: string;

  @IsString()
  avatar: string;

  @Type(() => ProfileDTO)
  profile: ProfileDTO;

  @IsMongoId()
  id: string;

  constructor(user: Partial<UserDTO>) {
    super(user);
    if (user.id) this.id = user.id;
    if (user.username) this.username = user.username;
    if (user.email) this.email = user.email;
    if (user.phone) this.phone = user.phone;
    if (user.avatar) this.avatar = user.avatar;
    if (user.profile) this.profile = user.profile;
    if (user.password) this.password = user.password
  }
}
