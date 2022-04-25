import { ForbiddenException, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ResponseDTO } from "base/dtos/response.dto";
import { UserErrorCode } from "enums/errorCode.enum";
import { User } from "domains/social/user.domain";
import { BaseCommand } from "base/cqrs/command.base";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { Image } from "domains/social/media.domain";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { MediaType } from "enums/social.enum";
import { EditAlbumRequest } from "./editAlbumRequest";
import { IAlbumService } from "modules/user/services/album.service";
import { IAlbumMediaRepository } from "modules/user/interfaces/repositories/albumMedia.interface";
import { IAlbumRepository } from "modules/user/interfaces/repositories/album.interface";
import { EditAlbumResponse } from "./editAlbumResponse";

export class EditAlbumCommand extends BaseCommand {
  req: EditAlbumRequest;
  constructor(tx: ITransaction, user: User, post: EditAlbumRequest) {
    super(tx, user);
    this.req = Object.assign(new EditAlbumRequest(), post);
  }
}

@CommandHandler(EditAlbumCommand)
export class EditAlbumCommandHandler
  implements ICommandHandler<EditAlbumCommand> {
  constructor(
    @Inject("IAlbumService")
    private _albumService: IAlbumService,
    @Inject("IAlbumRepository")
    private _albumRepo: IAlbumRepository,
    @Inject("IStorageService")
    private _storageService: IStorageService,
    @Inject("IAlbumMediaRepository")
    private _albumMediaRepo: IAlbumMediaRepository,
  ) { }
  async execute(command: EditAlbumCommand): Promise<EditAlbumResponse> {
    const { user, tx, req } = command;
    const existedAlbum = await this._albumService.getAlbumDetail(req.id);

    if (existedAlbum.owner.id !== user.id)
      throw new ForbiddenException(
        ResponseDTO.fail(
          "You have no permission to edit post",
          UserErrorCode.INVALID_OWNER
        )
      );

    let deleteMedias = await this._albumMediaRepo.getMedias(req.deleteImages)

    // Delete images
    if (req.deleteImages?.length > 0) {
      deleteMedias = await this._storageService.deleteFiles(deleteMedias)
    }

    // Add new images
    if (req.addImages && req.addImages.length > 0) {
      const keys = await this._storageService.makePublic(
        command.req.addImages,
        MediaType.IMAGE,
        "album"
      );
      req.addImages = keys
    }
    
    const updateDate = existedAlbum.update({
      ...req,
      medias: req.addImages?.map(image => new Image({ key: image }))
    })

    if (updateDate.medias?.length > 0) {
      await this._albumMediaRepo.setTransaction(tx).addMedias(updateDate.medias, existedAlbum)
    }

    if (deleteMedias?.length > 0) {
      await this._albumMediaRepo.setTransaction(tx).deleteMedias(deleteMedias)
    }

    await this._albumRepo.setTransaction(tx).updateAlbum(existedAlbum, updateDate)

    return new EditAlbumResponse()
  }
}
