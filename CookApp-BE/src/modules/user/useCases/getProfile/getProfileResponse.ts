import { ApiResponseProperty } from "@nestjs/swagger";
import { MediaResponse, ProfileResponse } from "base/dtos/response.dto";
import { User } from "domains/social/user.domain";


export class GetProfileResponse {
  @ApiResponseProperty({ type: ProfileResponse })
  profile: ProfileResponse

  @ApiResponseProperty({ type: String })
  displayName: string

  @ApiResponseProperty({ type: MediaResponse })
  avatar: MediaResponse

  constructor(user: User) {
    this.displayName = user.displayName
    this.avatar = new MediaResponse(user.avatar)
    this.profile = new ProfileResponse(user)
  }
}
