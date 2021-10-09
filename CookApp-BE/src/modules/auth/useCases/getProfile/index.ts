import { Inject } from "@nestjs/common";
import { ICommandHandler, IQuery, QueryHandler } from "@nestjs/cqrs";
import { ProfileDTO } from "modules/auth/dtos/profile.dto";
import { UserDTO } from "modules/auth/dtos/user.dto";
import { IUserService } from "modules/auth/services/user.service";

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
  async execute(command: GetProfileQuery): Promise<UserDTO> {
    return this._userService.getProfile(command.user.id);
  }
}
