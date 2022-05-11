import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { PageOptionsDto } from "base/pageOptions.base";
import { User } from "domains/social/user.domain";
import { IFoodSeService } from "modules/core/adapters/out/services/foodSe.service";
import { GetUnitsResponse } from "./getUnitsResponse";
import { IUnitRepository } from "modules/core/adapters/out/repositories/unit.repository";
import { Unit } from "domains/core/ingredient.domain";

export class GetUnitsQuery extends BaseQuery {
  queryOptions: PageOptionsDto;
  constructor(user: User, queryOptions?: PageOptionsDto) {
    super(user);
    this.queryOptions = queryOptions;
  }
}

@QueryHandler(GetUnitsQuery)
export class GetUnitsQueryHandler implements IQueryHandler<GetUnitsQuery> {
  constructor(
    @Inject("IUnitRepository")
    private _unitRepo: IUnitRepository,
    @Inject("IFoodSeService")
    private _foodSeService: IFoodSeService
  ) {}
  async execute(query: GetUnitsQuery): Promise<GetUnitsResponse> {
    const { queryOptions } = query;
    let units: Unit[];
    let totalCount = 0;

    if (queryOptions.q) {
      // const [ids, total] = await this._foodSeService.findManyByNameAndCount(queryOptions.q, queryOptions)
      // totalCount = total
      // foods = await this._unitRepo.getByIds(ids)
    } else {
      [units, totalCount] = await this._unitRepo.getUnits(queryOptions);
    }

    let meta: PageMetadata;
    if (units.length > 0) {
      meta = new PageMetadata(
        queryOptions.offset,
        queryOptions.limit,
        totalCount
      );
    }
    return new GetUnitsResponse(units, meta);
  }
}
