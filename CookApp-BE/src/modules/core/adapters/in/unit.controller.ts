import {
  Controller,
  Get,
  Query,
} from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PageOptionsDto } from "base/pageOptions.base";
import { Result } from "base/result.base";
import {
  ApiFailResponseCustom,
  ApiOKResponseCustom,
} from "decorators/apiSuccessResponse.decorator";
import { RequirePermissions } from "decorators/roles.decorator";
import { HttpUserReq } from "decorators/user.decorator";
import { User } from "domains/social/user.domain";
import { GetFoodsResponse } from "modules/core/useCases/getFoods/getFoodsResponse";
import { GetUnitsQuery } from "modules/core/useCases/getUnits";
import { GetUnitsResponse } from "modules/core/useCases/getUnits/getUnitsResponse";
import { ParseHttpRequestPipe } from "pipes/parseRequest.pipe";

@Controller("units")
@ApiTags("Units")
@ApiBearerAuth()
@RequirePermissions("manage_unit")
export class UnitController {
  constructor(private _queryBus: QueryBus) {}

  @Get()
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(GetUnitsResponse, "Get units successfully")
  @RequirePermissions("read_unit")
  async getUnits(
    @Query(new ParseHttpRequestPipe<typeof PageOptionsDto>())
    query: PageOptionsDto,
    @HttpUserReq() user: User
  ): Promise<Result<GetFoodsResponse>> {
    const unitsQuery = new GetUnitsQuery(user, query);
    const result = await this._queryBus.execute(unitsQuery);
    return Result.ok(result, {
      messages: ["Get units successfully"],
    });
  }
}
