import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BaseCommand } from "base/cqrs/command.base";
import { UserDTO } from "dtos/social/user.dto";
import { MediaType } from "enums/mediaType.enum";
import { IUserService } from "modules/auth/services/user.service";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { clean, createUpdatingObject, isImageKey } from "utils";
import { UpdateProfileRequest } from "./updateProfileRequest";
import { Transaction } from "neo4j-driver";
import { IUserRepository } from "modules/auth/interfaces/repositories/user.interface";

export class UpdateProfileCommand extends BaseCommand {
  updateProfileReq: UpdateProfileRequest;
  constructor(
    tx: Transaction,
    user: UserDTO,
    profile: UpdateProfileRequest
  ) {
    super(tx, user);
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
      .setTransaction(command.tx)
      .updateUserProfile(user.id, profile);

    if (updatedUser.avatar && isImageKey(updatedUser.avatar)) {
      updatedUser.avatar = (
        await this._storageService.getDownloadUrls([updatedUser.avatar])
      )[0];
    }
    return;
  }
}
