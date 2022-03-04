import { ApiResponseProperty } from "@nestjs/swagger";
import { ProfileResponse } from "base/dtos/response.dto";
import { User } from "domains/social/user.domain";


export class GetProfileResponse {
  @ApiResponseProperty({ type: ProfileResponse })
  profile: ProfileResponse

  @ApiResponseProperty({ type: String })
  displayName: string

  @ApiResponseProperty({ type: String })
  avatar: string

  constructor(user: User) {
    this.displayName = user.displayName
    this.avatar = user.avatar
    this.profile = new ProfileResponse(user.profile)
  }
}
