import { Inject } from "@nestjs/common";
import { ICommandHandler, IQuery, QueryHandler } from "@nestjs/cqrs";
import { UserDTO } from "dtos/user.dto";
import { IUserService } from "modules/auth/services/user.service";
import { GetProfileResponse } from "./getProfileResponse";

export class GetProfileQuery implements IQuery {
  user: UserDTO;
  constructor(user: UserDTO) {
    this.user = user;
  }
}

@QueryHandler(GetProfileQuery)
export class GetProfileQueryHandler
  implements ICommandHandler<GetProfileQuery> {
  constructor(
    @Inject("IUserService")
    private _userService: IUserService
  ) {}
  async execute(command: GetProfileQuery): Promise<GetProfileResponse> {
    return this._userService.getUserById(command.user.id);
  }
}
