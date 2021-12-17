import { ApiResponseProperty } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { Type } from "class-transformer";
import { UserDTO } from "dtos/social/user.dto";

export class GetUsersResponse {
  @ApiResponseProperty({ type: [UserDTO] })
  @Type(() => UserDTO)
  users: UserDTO[];

  @ApiResponseProperty({ type: PageMetadata })
  @Type(() => PageMetadata)
  metadata: PageMetadata;

  constructor(users: UserDTO[], meta: PageMetadata) {
    this.users = users;
    this.metadata = meta;
  }
}
