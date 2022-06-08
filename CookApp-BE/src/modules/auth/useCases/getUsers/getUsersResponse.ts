import { ApiResponseProperty } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { UserResponse } from "base/dtos/response.dto";
import { User } from "domains/social/user.domain";

export class GetUsersResponse {
  @ApiResponseProperty({ type: [UserResponse] })
  users: UserResponse[];

  @ApiResponseProperty({ type: PageMetadata })
  metadata: PageMetadata;

  constructor(users: User[], meta: PageMetadata) {
    this.users = users.map((user) => new UserResponse(user));
    this.metadata = meta;
  }
}
