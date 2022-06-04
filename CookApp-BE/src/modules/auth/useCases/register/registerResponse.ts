import { ApiResponseProperty } from "@nestjs/swagger";
import { User } from "domains/social/user.domain";

export class RegisterResponse {
  @ApiResponseProperty({ type: String })
  id: string;

  constructor(user: User) {
    this.id = user.id;
  }
}
