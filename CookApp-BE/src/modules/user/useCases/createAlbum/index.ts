import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { User } from "domains/social/user.domain";
import { BaseCommand } from "base/cqrs/command.base";
import { Image, Video } from "domains/social/media.domain";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import _ = require("lodash");
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { CreateAlbumRequest } from "./createAlbumRequest";
import { CreateAlbumResponse } from "./createAlbumResponse";
import { Album } from "domains/social/album.domain";
import { IAlbumService } from "modules/user/services/album.service";
import { MediaType } from "enums/social.enum";

export class CreateAlbumCommand extends BaseCommand {
  req: CreateAlbumRequest;
  constructor(user: User, album: CreateAlbumRequest, tx: ITransaction) {
    super(tx, user);
    this.req = album;
  }
}

@CommandHandler(CreateAlbumCommand)
export class CreateAlbumCommandHandler
  implements ICommandHandler<CreateAlbumCommand>
{
  constructor(
    @Inject("IAlbumService")
    private _albumService: IAlbumService,
    @Inject("IStorageService")
    private _storageService: IStorageService,
  ) { }
  async execute(command: CreateAlbumCommand): Promise<CreateAlbumResponse> {
    const { req, user, tx } = command;

    if (req.images?.length > 0) {
      req.images = await this._storageService.makePublic(
        req.images,
        MediaType.IMAGE,
        "album"
      );
    }

    if (req.videos?.length > 0) {
      req.videos = await this._storageService.makePublic(
        req.videos,
        MediaType.VIDEO,
        "album"
      );
    }

    const medias = _.unionBy(
      req.images?.map(image => new Image({ key: image })),
      req.videos?.map(video => new Video({ key: video })),
      'key'
    )

    const creatingAlbum = new Album({
      medias,
      name: req.name,
      description: req.description,
      owner: user
    })

    const result = await this._albumService.createAlbum(creatingAlbum, tx);
    return new CreateAlbumResponse(result);
  }
}
