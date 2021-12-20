import { Controller, Get, Query } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PageOptionsDto } from "base/pageOptions.base";
import { Result } from "base/result.base";
import {
  ApiFailResponseCustom,
  ApiOKResponseCustom,
} from "decorators/ApiSuccessResponse.decorator";
import { User } from "decorators/user.decorator";
import { UserDTO } from "dtos/social/user.dto";
import { GetUsersQuery } from "modules/user/useCases/getUsers";
import { GetUsersResponse } from "modules/user/useCases/getUsers/getUsersResponse";
import { ParsePaginationPipe } from "pipes/parsePagination.pipe";

@Controller("users")
@ApiTags("Users")
@ApiBearerAuth()
export class UserController {
  constructor(private _queryBus: QueryBus) {}

  @Get()
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(GetUsersResponse, "Get users successfully")
  async findUsers(
    @Query(ParsePaginationPipe) query: PageOptionsDto,
    @User() user: UserDTO
  ): Promise<Result<GetUsersResponse>> {
    const queryOp = new GetUsersQuery(user, query);
    const result = await this._queryBus.execute(queryOp);
    return Result.ok(result, {
      messages: ["Get users successfully"],
    });
  }
}