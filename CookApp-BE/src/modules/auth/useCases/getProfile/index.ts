import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { UserDTO } from "dtos/user.dto";
import { IUserService } from "modules/auth/services/user.service";
import { GetProfileResponse } from "./getProfileResponse";

export class GetProfileQuery extends BaseQuery {
  constructor(user: UserDTO) {
    super(user);
  }
}

@QueryHandler(GetProfileQuery)
export class GetProfileQueryHandler implements IQueryHandler<GetProfileQuery> {
  constructor(
    @Inject("IUserService")
    private _userService: IUserService
  ) {}
  async execute(query: GetProfileQuery): Promise<GetProfileResponse> {
    return this._userService.getUserById(query.user.id);
  }
}
