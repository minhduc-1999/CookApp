import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { PageOptionsDto } from "base/pageOptions.base";
import { User } from "domains/social/user.domain";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { IFoodRepository } from "modules/core/adapters/out/repositories/food.repository";
import { GetFoodsResponse } from "./getFoodsResponse";
import { Image } from "domains/social/media.domain";
export class GetFoodsQuery extends BaseQuery {
  queryOptions: PageOptionsDto;
  constructor(user: User, queryOptions?: PageOptionsDto) {
    super(user);
    this.queryOptions = queryOptions;
  }
}

@QueryHandler(GetFoodsQuery)
export class GetFoodsQueryHandler implements IQueryHandler<GetFoodsQuery> {
  constructor(
    @Inject("IFoodRepository")
    private _foodRepo: IFoodRepository,
    @Inject("IStorageService") private _storageService: IStorageService
  ) { }
  async execute(query: GetFoodsQuery): Promise<GetFoodsResponse> {
    const { queryOptions } = query;
    const foods = await this._foodRepo.getFoods(queryOptions);
    for (let food of foods) {
      food.photos = (await this._storageService.getDownloadUrls(food.photos)) as Image[];
      if (food.steps.length > 0) {
        food.steps = await Promise.all(
          food.steps.map(async (step) => {
            return {
              ...step,
              photos: (await this._storageService.getDownloadUrls(step.photos)) as Image[],
            };
          })
        );
      }
    }
    const totalCount = await this._foodRepo.getTotalFoods(query.queryOptions);
    let meta: PageMetadata;
    if (foods.length > 0) {
      meta = new PageMetadata(
        queryOptions.offset,
        queryOptions.limit,
        totalCount
      );
    }
    return new GetFoodsResponse(foods, meta);
  }
}
