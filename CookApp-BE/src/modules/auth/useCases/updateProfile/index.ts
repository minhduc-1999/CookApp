import { Inject } from "@nestjs/common";
import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { UserDTO } from "dtos/user.dto";
import { IUserRepository } from "modules/auth/adapters/out/repositories/user.repository";
import { IUserService } from "modules/auth/services/user.service";
import { createUpdatingNestedObject } from "utils";
import { UpdateProfileRequest } from "./updateProfileRequest";
import { UpdateProfileResponse } from "./updateProfileResponse";

export class UpdateProfileCommand implements ICommand {
  user: UserDTO;
  updateProfileReq: UpdateProfileRequest
  constructor(user: UserDTO, profile: UpdateProfileRequest) {
    this.user = user;
    this.updateProfileReq = profile;
  }
}

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileCommandHandler
  implements ICommandHandler<UpdateProfileCommand> {
  constructor(
    @Inject("IUserService")
    private _userService: IUserService,
    @Inject("IUserRepository")
    private _userRepo: IUserRepository
  ) {}
  async execute(command: UpdateProfileCommand): Promise<UpdateProfileResponse> {
    const user = await this._userService.getUserById(command.user.id);
    const profile = createUpdatingNestedObject<UpdateProfileRequest, UserDTO>(
      "profile",
      command.updateProfileReq,
      user.id
    );
    return this._userRepo.updateUserProfile(user.id, profile);
  }
}
