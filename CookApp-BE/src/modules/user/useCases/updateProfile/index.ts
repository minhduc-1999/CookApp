import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BaseCommand } from "base/cqrs/command.base";
import { User } from "domains/social/user.domain";
import { MediaType } from "enums/mediaType.enum";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { clean, createUpdatingObject } from "utils";
import { UpdateProfileRequest } from "./updateProfileRequest";
import { Transaction } from "neo4j-driver";
import { IUserRepository } from "modules/auth/interfaces/repositories/user.interface";
import { Image } from "domains/social/media.domain";

export class UpdateProfileCommand extends BaseCommand {
  updateProfileReq: UpdateProfileRequest;
  constructor(
    tx: Transaction,
    user: User,
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
    @Inject("IUserRepository")
    private _userRepo: IUserRepository,
    @Inject("IStorageService")
    private _storageService: IStorageService,
  ) { }
  async execute(command: UpdateProfileCommand): Promise<void> {
    const { user } = command
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
      user.id,
    );


    const updatingUserProfile = new User({
        ...profile,
        avatar: new Image({
          key: profile.avatar,
        })
    })

    const updatedUser = await this._userRepo
      .setTransaction(command.tx)
      .updateUserProfile(user.id, updatingUserProfile);

    if (updatedUser.avatar && updatedUser.avatar.isValidKey()) {
      updatedUser.avatar = (
        await this._storageService.getDownloadUrls([updatedUser.avatar])
      )[0];
    }
    return;
  }
}
