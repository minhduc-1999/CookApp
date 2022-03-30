import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BaseCommand } from "base/cqrs/command.base";
import { User } from "domains/social/user.domain";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { clean, createUpdatingObject } from "utils";
import { UpdateProfileRequest } from "./updateProfileRequest";
import { IUserRepository } from "modules/auth/interfaces/repositories/user.interface";
import { Image } from "domains/social/media.domain";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { MediaType } from "enums/social.enum";

export class UpdateProfileCommand extends BaseCommand {
  updateProfileReq: UpdateProfileRequest;
  constructor(
    tx: ITransaction,
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
        MediaType.IMAGE
      );
      command.updateProfileReq.avatar = result[0];
    }
    const userProfile = await this._userRepo.getProfile(user.id)

    const { birthDate, avatar, ...profile } = createUpdatingObject(
      clean(command.updateProfileReq),
    );

    const uAvatar = avatar ? new Image({ key: avatar }) : user.avatar

    const userWithNewProfile = new User({
      ...userProfile,
      ...profile,
      avatar: uAvatar,
      birthDate: birthDate ? new Date(birthDate) : userProfile.birthDate
    })

    await this._userRepo
      .setTransaction(command.tx)
      .updateUserProfile(userWithNewProfile);

    return;
  }
}
