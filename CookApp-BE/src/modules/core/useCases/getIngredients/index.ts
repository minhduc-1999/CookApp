import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { PageOptionsDto } from "base/pageOptions.base";
import { User } from "domains/social/user.domain";
import { Ingredient } from "domains/core/ingredient.domain";
import { IIngredientRepository } from "modules/core/adapters/out/repositories/ingredient.repository";
import { GetIngredientsResponse } from "./getIngredientsResponse";

export class GetIngredientsQuery extends BaseQuery {
  queryOptions: PageOptionsDto;
  constructor(user: User, queryOptions?: PageOptionsDto) {
    super(user);
    this.queryOptions = queryOptions;
  }
}

@QueryHandler(GetIngredientsQuery)
export class GetIngredientsQueryHandler
  implements IQueryHandler<GetIngredientsQuery>
{
  constructor(
    @Inject("IIngredientRepository")
    private _ingredientRepo: IIngredientRepository
  ) {}
  async execute(query: GetIngredientsQuery): Promise<GetIngredientsResponse> {
    const { queryOptions } = query;
    let ingredients: Ingredient[];
    let totalCount = 0;

    [ingredients, totalCount] = await this._ingredientRepo.getIngredients(
      queryOptions
    );

    let meta: PageMetadata;
    if (ingredients.length > 0) {
      meta = new PageMetadata(
        queryOptions.offset,
        queryOptions.limit,
        totalCount
      );
    }
    return new GetIngredientsResponse(ingredients, meta);
  }
}
