import { Inject, NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { ResponseDTO } from "base/dtos/response.dto";
import { PageOptionsDto } from "base/pageOptions.base";
import { User } from "domains/social/user.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { IFoodRepository } from "modules/core/adapters/out/repositories/food.repository";
import { IFoodVoteRepository } from "modules/core/adapters/out/repositories/foodVote.repository";
import { GetFoodVotesResponse } from "./getFoodVotesResponse";

export class GetFoodVotesQuery extends BaseQuery {
  queryOptions: PageOptionsDto;
  foodId: string;
  constructor(user: User, foodId: string, queryOptions?: PageOptionsDto) {
    super(user);
    this.queryOptions = queryOptions;
    this.foodId = foodId
  }
}

@QueryHandler(GetFoodVotesQuery)
export class GetFoodVotesQueryHandler
  implements IQueryHandler<GetFoodVotesQuery>
{
  constructor(
    @Inject("IFoodVoteRepository")
    private _foodVoteRepo: IFoodVoteRepository,
    @Inject("IFoodRepository")
    private _foodRepo: IFoodRepository
  ) {}
  async execute(query: GetFoodVotesQuery): Promise<GetFoodVotesResponse> {
    const { queryOptions, foodId } = query;
    const food = await this._foodRepo.getById(foodId);
    if (!food)
      throw new NotFoundException(
        ResponseDTO.fail("Food not found", UserErrorCode.FOOD_NOT_FOUND)
      );

    const [votes, totalCount] = await this._foodVoteRepo.getVotes(
      food,
      queryOptions
    );

    let meta: PageMetadata;

    if (votes.length > 0) {
      meta = new PageMetadata(
        queryOptions.offset,
        queryOptions.limit,
        totalCount
      );
    }
    return new GetFoodVotesResponse(votes, meta);
  }
}
