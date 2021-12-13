import { Controller, Get, Query } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PageOptionsDto } from "base/pageOptions.base";
import { Result } from "base/result.base";
import {
  ApiFailResponseCustom,
  ApiOKResponseCustom,
} from "decorators/ApiSuccessResponse.decorator";
import { User } from "decorators/user.decorator";
import { UserDTO } from "dtos/social/user.dto";
import { GetFoodsQuery } from "modules/core/useCases/getFoods";
import { GetFoodsResponse } from "modules/core/useCases/getFoods/getFoodsResponse";
import { ParsePaginationPipe } from "pipes/parsePagination.pipe";

@Controller("foods")
@ApiTags("Foods")
@ApiBearerAuth()
export class FoodController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) {}

  @Get()
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(GetFoodsResponse, "Get foods foods successfully")
  async getFeedPosts(
    @Query(ParsePaginationPipe) query: PageOptionsDto,
    @User() user: UserDTO
  ): Promise<Result<GetFoodsResponse>> {
    const foodQuery = new GetFoodsQuery(user, query);
    const result = await this._queryBus.execute(foodQuery);
    return Result.ok(result, {
      messages: ["Get foods foods successfully"],
    });
  }
}
