import { ApiProperty } from "@nestjs/swagger";

export class LoginResponse {
  @ApiProperty({ type: String })
  accessToken: string;
}
