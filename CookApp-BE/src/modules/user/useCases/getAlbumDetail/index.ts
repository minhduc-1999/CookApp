import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { MediaResponse } from "base/dtos/response.dto";
import { User } from "domains/social/user.domain";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { IReactionRepository } from "modules/user/interfaces/repositories/reaction.interface";
import { IAlbumService } from "modules/user/services/album.service";
import { GetAlbumDetailResponse } from "./getAlbumResponse";

export class GetAlbumDetailQuery extends BaseQuery {
  albumId: string;
  constructor(user: User, albumId: string) {
    super(user);
    this.albumId = albumId;
  }
}

@QueryHandler(GetAlbumDetailQuery)
export class GetAlbumDetailQueryHandler
  implements IQueryHandler<GetAlbumDetailQuery>
{
  constructor(
    @Inject("IAlbumService")
    private _albumService: IAlbumService,
    @Inject("IStorageService")
    private _storageService: IStorageService,
    @Inject("IReactionRepository")
    private _reacRepo: IReactionRepository,
  ) { }
  async execute(query: GetAlbumDetailQuery): Promise<GetAlbumDetailResponse> {
    const { albumId, user } = query

    const album = await this._albumService.getAlbumDetail(albumId);

    album.medias = await this._storageService.getDownloadUrls(album.medias);

    if (album.owner?.avatar) {
      [album.owner.avatar] = await this._storageService.getDownloadUrls([album.owner.avatar])
    }

    const result = new GetAlbumDetailResponse(album)

    const task = album.medias?.map(async media => {
      const mediaReaction = await this._reacRepo.findById(user.id, media.id)
      return new MediaResponse(media, mediaReaction)
    })

    result.medias = await Promise.all(task)

    return result;
  }
}
