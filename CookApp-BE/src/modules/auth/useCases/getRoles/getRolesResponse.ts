import { ApiResponseProperty } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { RoleResponse } from "base/dtos/response.dto";
import { Role } from "domains/social/account.domain";

export class GetRolesResponse {
  @ApiResponseProperty({ type: [RoleResponse] })
  roles: RoleResponse[];

  @ApiResponseProperty({ type: PageMetadata })
  metadata: PageMetadata;

  constructor(roles: Role[], meta: PageMetadata) {
    this.roles = roles.map((role) => new RoleResponse(role));
    this.metadata = meta;
  }
}
