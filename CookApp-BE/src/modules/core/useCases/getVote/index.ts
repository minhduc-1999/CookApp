import { Inject, NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { ResponseDTO } from "base/dtos/response.dto";
import { User } from "domains/social/user.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { IFoodRepository } from "modules/core/adapters/out/repositories/food.repository";
import { IFoodVoteRepository } from "modules/core/adapters/out/repositories/foodVote.repository";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { GetVoteResponse } from "./getVoteResponse";

export class GetVoteQuery extends BaseQuery {
  foodId: string;
  constructor(user: User, foodId: string) {
    super(user);
    this.foodId = foodId;
  }
}

@QueryHandler(GetVoteQuery)
export class GetVoteQueryHandler implements IQueryHandler<GetVoteQuery> {
  constructor(
    @Inject("IFoodVoteRepository")
    private _foodVoteRepo: IFoodVoteRepository,
    @Inject("IFoodRepository")
    private _foodRepo: IFoodRepository,
    @Inject("IStorageService")
    private _storageService: IStorageService
  ) {}
  async execute(query: GetVoteQuery): Promise<GetVoteResponse> {
    const { user, foodId } = query;
    const food = await this._foodRepo.getById(foodId);
    if (!food)
      throw new NotFoundException(
        ResponseDTO.fail("Food not found", UserErrorCode.FOOD_NOT_FOUND)
      );

    const vote = await this._foodVoteRepo.findVote(user, food);

    if (!vote)
      throw new NotFoundException(ResponseDTO.fail("Vote not found"));

    [vote.author.avatar] = await this._storageService.getDownloadUrls([
      vote.author?.avatar,
    ]);

    return new GetVoteResponse(vote);
  }
}
