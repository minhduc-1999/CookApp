import { ApiResponseProperty } from "@nestjs/swagger";
import { RoleType } from "enums/system.enum";

export class LoginResponse {
  @ApiResponseProperty({type: String})
  loginToken: string;

  @ApiResponseProperty({ type: String })
  accessToken: string;

  @ApiResponseProperty({ type: String })
  userId: string;

  @ApiResponseProperty({ type: String })
  email: string;

  @ApiResponseProperty({ type: Boolean })
  emailVerified: boolean;

  @ApiResponseProperty({ type: String })
  role: RoleType;
}
