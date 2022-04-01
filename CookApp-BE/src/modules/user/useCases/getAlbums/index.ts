import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { User } from "domains/social/user.domain";
import { IUserService } from "modules/auth/services/user.service";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { IAlbumRepository } from "modules/user/interfaces/repositories/album.interface";
import { GetAlbumsResponse } from "./getAlbumResponse";
import { GetAlbumsRequest } from "./getWallPostsRequest";

export class GetAlbumsQuery extends BaseQuery {
  req: GetAlbumsRequest
  constructor(user: User, req?: GetAlbumsRequest) {
    super(user);
    this.req = req
  }
}

@QueryHandler(GetAlbumsQuery)
export class GetAlbumsQueryHandler
  implements IQueryHandler<GetAlbumsQuery>
{
  constructor(
    @Inject("IAlbumRepository")
    private _albumRepo: IAlbumRepository,
    @Inject("IUserService")
    private _userService: IUserService,
    @Inject("IStorageService") private _storageService: IStorageService
  ) { }
  async execute(query: GetAlbumsQuery): Promise<GetAlbumsResponse> {
    const { req } = query;
    const target = await this._userService.getUserById(req.targetId)
    const [albums, total] = await this._albumRepo.getAlbums(target.id, req);
    for (let album of albums) {
      album.medias = await this._storageService.getDownloadUrls(album.medias);
    }
    let meta: PageMetadata;
    if (albums.length > 0) {
      meta = new PageMetadata(
        req.offset,
        req.limit,
        total
      );
    }
    return new GetAlbumsResponse(albums, meta);
  }
}
