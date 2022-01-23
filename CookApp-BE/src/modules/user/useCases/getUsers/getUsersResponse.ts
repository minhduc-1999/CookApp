import { ApiResponseProperty, PickType } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { UserDTO } from "dtos/social/user.dto";

class UserResponse extends PickType(UserDTO, ["id", "avatar", "displayName"]) { }

export class GetUsersResponse {
  @ApiResponseProperty({ type: [UserResponse] })
  users: UserResponse[];

  @ApiResponseProperty({ type: PageMetadata })
  metadata: PageMetadata;

  constructor(users: UserDTO[], meta: PageMetadata) {
    this.users = users.map(user => {
      return {
        id: user.id,
        avatar: user.avatar,
        displayName: user.displayName,
      }
    })
    this.metadata = meta;
  }
}
