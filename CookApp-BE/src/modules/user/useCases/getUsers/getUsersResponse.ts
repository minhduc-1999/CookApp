import { ApiResponseProperty, PickType } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { User } from "domains/social/user.domain";

class UserResponse extends PickType(User, ["id", "avatar", "displayName"]) { }

export class GetUsersResponse {
  @ApiResponseProperty({ type: [UserResponse] })
  users: UserResponse[];

  @ApiResponseProperty({ type: PageMetadata })
  metadata: PageMetadata;

  constructor(users: User[], meta: PageMetadata) {
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
