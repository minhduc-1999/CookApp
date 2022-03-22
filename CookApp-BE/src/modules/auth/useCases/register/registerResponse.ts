import { ApiResponseProperty } from "@nestjs/swagger";

export class RegisterResponse {
  @ApiResponseProperty({ type: String })
  id: string
}
