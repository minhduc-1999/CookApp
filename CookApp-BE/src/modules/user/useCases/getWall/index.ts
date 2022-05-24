import { Inject, NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { ResponseDTO } from "base/dtos/response.dto";
import { User } from "domains/social/user.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import _ = require("lodash");
import { IConversationRepository } from "modules/communication/adapters/out/conversation.repository";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { IFollowRepository } from "modules/user/interfaces/repositories/follow.interface";
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
    @Inject("IFollowRepository")
    private _followRepo: IFollowRepository,
    @Inject("IStorageService")
    private _storageService: IStorageService,
    @Inject("IConversationRepository")
    private _conversationRepo: IConversationRepository
  ) {}
  async execute(query: GetWallQuery): Promise<GetWallResponse> {
    const { user, targetId } = query;
    const wall = await this._wallRepo.getWall(targetId);
    console.log(wall);
    if (!wall) {
      throw new NotFoundException(
        ResponseDTO.fail("User not found", UserErrorCode.USER_NOT_FOUND)
      );
    }
    wall.avatar = (
      await this._storageService.getDownloadUrls([wall.avatar])
    )[0];
    const follow = await this._followRepo.getFollow(user.id, targetId);
    const hasRecommendations = wall.account.role.sign === "user" ? false : true;
    const conv = await this._conversationRepo.findDirectConversation(
      user.id,
      targetId
    );
    return new GetWallResponse(
      wall,
      !_.isNil(follow),
      conv,
      hasRecommendations
    );
  }
}
