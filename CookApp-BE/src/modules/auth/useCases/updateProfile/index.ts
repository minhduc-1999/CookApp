import { Inject } from "@nestjs/common";
import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { BaseCommand } from "base/cqrs/command.base";
import { UserDTO } from "dtos/user.dto";
import { IUserRepository } from "modules/auth/adapters/out/repositories/user.repository";
import { IUserService } from "modules/auth/services/user.service";
import { ClientSession } from "mongoose";
import { clean, createUpdatingNestedObject, createUpdatingObject } from "utils";
import { UpdateProfileRequest } from "./updateProfileRequest";
import { UpdateProfileResponse } from "./updateProfileResponse";

export class UpdateProfileCommand extends BaseCommand {
  updateProfileReq: UpdateProfileRequest;
  constructor(
    session: ClientSession,
    user: UserDTO,
    profile: UpdateProfileRequest
  ) {
    super(session, user);
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
    const profile = createUpdatingObject(
      clean(command.updateProfileReq),
      user.id
    );
    return this._userRepo
      .setSession(command.session)
      .updateUserProfile(user.id, profile);
  }
}
