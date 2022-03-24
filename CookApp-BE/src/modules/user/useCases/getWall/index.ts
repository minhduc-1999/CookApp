import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { User } from "domains/social/user.domain";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { IWallRepository } from "modules/user/interfaces/repositories/wall.interface";
import { GetWallResponse } from "./getWallResponse";
export class GetWallQuery extends BaseQuery {
  targetId: string;
  constructor(user: User, targetId: string) {
    super(user);
    this.targetId = targetId;
  }
}

@QueryHandler(GetWallQuery)
export class GetWallQueryHandler implements IQueryHandler<GetWallQuery> {
  constructor(
    @Inject("IWallRepository")
    private _wallRepo: IWallRepository,
    @Inject("IStorageService")
    private _storageService: IStorageService,
  ) {}
  async execute(query: GetWallQuery): Promise<GetWallResponse> {
    const wall = await this._wallRepo.getWall(query.targetId);
    wall.avatar = (await this._storageService.getDownloadUrls([wall.avatar]))[0]
    const isFollowed = null
    //TODO
    // const isFollowed = await this._wallRepo.isFollowed(
    //   query.user.id,
    //   query.targetId
    // );
    return new GetWallResponse(wall, isFollowed);
  }
}
