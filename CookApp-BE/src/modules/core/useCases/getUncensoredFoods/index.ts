import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { PageOptionsDto } from "base/pageOptions.base";
import { User } from "domains/social/user.domain";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { IFoodRepository } from "modules/core/adapters/out/repositories/food.repository";
import { Image } from "domains/social/media.domain";
import { Food } from "domains/core/food.domain";
import { IFoodSeService } from "modules/core/adapters/out/services/foodSe.service";
import { GetUncensoredFoodsResponse } from "./getUncensoredFoodsResponse";
export class GetUncensoredFoodsQuery extends BaseQuery {
  queryOptions: PageOptionsDto;
  constructor(user: User, queryOptions?: PageOptionsDto) {
    super(user);
    this.queryOptions = queryOptions;
  }
}

@QueryHandler(GetUncensoredFoodsQuery)
export class GetUncensoredFoodsQueryHandler implements IQueryHandler<GetUncensoredFoodsQuery> {
  constructor(
    @Inject("IFoodRepository")
    private _foodRepo: IFoodRepository,
    @Inject("IStorageService")
    private _storageService: IStorageService,
    @Inject("IFoodSeService")
    private _foodSeService: IFoodSeService
  ) {}
  async execute(query: GetUncensoredFoodsQuery): Promise<GetUncensoredFoodsResponse> {
    const { queryOptions } = query;
    let foods: Food[];
    let totalCount = 0;

    if (queryOptions.q) {
      const [ids, total] = await this._foodSeService.findManyByNameAndCount(
        queryOptions.q,
        queryOptions
      );
      totalCount = total;
      const queryResult = await this._foodRepo.getByIds(ids);
      foods = ids.map((id) => queryResult.find((item) => item.id === id));
    } else {
      [foods, totalCount] = await this._foodRepo.getUncensoredFoods(queryOptions);
    }

    for (let food of foods) {
      food.photos = (await this._storageService.getDownloadUrls(
        food.photos
      )) as Image[];
      if (food.author?.avatar?.key)
        [food.author.avatar] = await this._storageService.getDownloadUrls([
          food.author.avatar,
        ]);
      if (food.steps.length > 0) {
        food.steps = await Promise.all(
          food.steps.map(async (step) => {
            return {
              ...step,
              photos: (await this._storageService.getDownloadUrls(
                step.photos
              )) as Image[],
            };
          })
        );
      }
    }

    let meta: PageMetadata;
    if (foods.length > 0) {
      meta = new PageMetadata(
        queryOptions.offset,
        queryOptions.limit,
        totalCount
      );
    }
    return new GetUncensoredFoodsResponse(foods, meta);
  }
}
