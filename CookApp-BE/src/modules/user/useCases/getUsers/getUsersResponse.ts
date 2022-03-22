import { ApiResponseProperty, } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { AuthorResponse } from "base/dtos/response.dto";
import { User } from "domains/social/user.domain";

export class GetUsersResponse {
  @ApiResponseProperty({ type: [AuthorResponse] })
  users: AuthorResponse[];

  @ApiResponseProperty({ type: PageMetadata })
  metadata: PageMetadata;

  constructor(users: User[], meta: PageMetadata) {
    this.users = users.map(user => {
      return new AuthorResponse(user)
    })
    this.metadata = meta;
  }
}
