import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { User } from "domains/social/user.domain";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { IFoodRepository } from "modules/core/adapters/out/repositories/food.repository";
import { GetFoodSavesResponse } from "./getFoodSavesResponse";
import { Image } from "domains/social/media.domain";
import { Food } from "domains/core/food.domain";
import { GetFoodSavesRequest } from "./getFoodSavesRequest";

export class GetFoodSavesQuery extends BaseQuery {
  req: GetFoodSavesRequest;
  constructor(user: User, req: GetFoodSavesRequest) {
    super(user);
    this.req = req;
  }
}

@QueryHandler(GetFoodSavesQuery)
export class GetFoodSavesQueryHandler
  implements IQueryHandler<GetFoodSavesQuery>
{
  constructor(
    @Inject("IFoodRepository")
    private _foodRepo: IFoodRepository,
    @Inject("IStorageService")
    private _storageService: IStorageService
  ) {}
  async execute(query: GetFoodSavesQuery): Promise<GetFoodSavesResponse> {
    const { user, req } = query;
    let foods: Food[];
    let totalCount = 0;

    [foods, totalCount] = await this._foodRepo.getFoodSaves(
      user.id,
      req.type,
      req
    );

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
      meta = new PageMetadata(req.offset, req.limit, totalCount);
    }
    return new GetFoodSavesResponse(foods, meta);
  }
}
