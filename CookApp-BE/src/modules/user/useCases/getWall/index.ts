import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { User } from "domains/social/user.domain";
import { IUserService } from "modules/auth/services/user.service";
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
    @Inject("IUserService")
    private _userService: IUserService,
  ) {}
  async execute(query: GetWallQuery): Promise<GetWallResponse> {
    const user = await this._userService.getUserById(query.targetId);
    const wall = await this._wallRepo.getWall(query.targetId);
    wall.user = user;
    const isFollowed = await this._wallRepo.isFollowed(
      query.user.id,
      query.targetId
    );
    return new GetWallResponse(wall, isFollowed);
  }
}
