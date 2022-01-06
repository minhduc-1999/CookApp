import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BaseCommand } from "base/cqrs/command.base";
import { UserDTO } from "dtos/social/user.dto";
import { MediaType } from "enums/mediaType.enum";
import { IUserRepository } from "modules/auth/adapters/out/repositories/user.repository";
import { IUserService } from "modules/auth/services/user.service";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { ClientSession } from "mongoose";
import { clean, createUpdatingNestedObject, createUpdatingObject, isImageKey } from "utils";
import { UpdateProfileRequest } from "./updateProfileRequest";
import { IWallRepository } from "modules/auth/adapters/out/repositories/wall.repository";

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
  implements ICommandHandler<UpdateProfileCommand>
{
  constructor(
    @Inject("IUserService")
    private _userService: IUserService,
    @Inject("IUserRepository")
    private _userRepo: IUserRepository,
    @Inject("IStorageService")
    private _storageService: IStorageService,
    @Inject("IWallRepository")
    private _wallRepo: IWallRepository
  ) {}
  async execute(command: UpdateProfileCommand): Promise<void> {
    const user = await this._userService.getUserById(command.user.id);
    if (command.updateProfileReq.avatar) {
      const { avatar } = command.updateProfileReq;
      const result = await this._storageService.replaceFiles(
        [user.avatar],
        [avatar],
        MediaType.AVATAR
      );
      command.updateProfileReq.avatar = result[0];
    }
    const profile = createUpdatingObject(
      clean(command.updateProfileReq),
      user.id
    );
    const updatedUser = await this._userRepo
      .setSession(command.session)
      .updateUserProfile(user.id, profile);

    await this._wallRepo.updateWallInfo(
      createUpdatingNestedObject(
        "user",
        { displayName: updatedUser.displayName, avatar: updatedUser.avatar },
        user.id
      ),
      user.id
    );

    if (updatedUser.avatar && isImageKey(updatedUser.avatar)) {
      updatedUser.avatar = (
        await this._storageService.getDownloadUrls([updatedUser.avatar])
      )[0];
    }
    return;
  }
}
