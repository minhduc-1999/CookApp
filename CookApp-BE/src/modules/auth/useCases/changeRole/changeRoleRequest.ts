import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsUUID } from "class-validator";
import { RoleType } from "enums/system.enum";

export class ChangeRoleRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  sign: RoleType;

  @IsUUID(4)
  @ApiProperty({ type: String })
  userId: string;
}
