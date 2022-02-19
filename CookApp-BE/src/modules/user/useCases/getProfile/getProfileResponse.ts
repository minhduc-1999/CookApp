import { ApiResponseProperty } from "@nestjs/swagger";
import { User } from "domains/social/user.domain";
import { Sex } from "enums/sex.enum";

class ProfileResponse {
  @ApiResponseProperty({ type: Number })
  height?: number;

  @ApiResponseProperty({ type: Number })
  weight?: number;

  @ApiResponseProperty({ type: Number })
  birthDate?: number;

  @ApiResponseProperty({ type: String })
  firstName?: string;

  @ApiResponseProperty({ type: String })
  lastName?: string;

  @ApiResponseProperty({ enum: Sex })
  sex?: Sex;
}

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
    this.profile = {
      height: user.profile?.height,
      weight: user.profile?.weight,
      birthDate: user.profile?.birthDate,
      firstName: user.profile?.firstName,
      lastName: user.profile?.lastName,
    }
  }
}
