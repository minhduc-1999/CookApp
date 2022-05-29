import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, Length } from "class-validator";

export class ChangePasswordRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  @Length(8, 20)
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  @Length(8, 20)
  @IsNotEmpty()
  newPassword: string;
}
