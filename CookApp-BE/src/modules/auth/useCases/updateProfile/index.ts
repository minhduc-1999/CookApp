import { Inject } from "@nestjs/common";
import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { UpdateProfileDTO } from "modules/auth/dtos/profile.dto";
import { UserDTO } from "modules/auth/dtos/user.dto";
import { IUserService } from "modules/auth/services/user.service";

export class UpdateProfileCommand implements ICommand {
  user: UserDTO;
  updateProfileDto: UpdateProfileDTO
  constructor(user: UserDTO, profile: UpdateProfileDTO) {
    this.user = user;
    this.updateProfileDto = profile;
  }
}

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileCommandHandler
  implements ICommandHandler<UpdateProfileCommand> {
  constructor(
    @Inject("IUserService")
    private _userService: IUserService
  ) {}
  async execute(command: UpdateProfileCommand): Promise<UserDTO> {
    return this._userService.updateProfile(command.user.id, command.updateProfileDto);
  }
}
