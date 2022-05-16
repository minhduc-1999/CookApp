import { Controller, Get, Query } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import {
    ApiBearerAuth,
  ApiTags,
} from "@nestjs/swagger";
import { Result } from "base/result.base";
import {
  ApiFailResponseCustom,
  ApiOKResponseCustom,
} from "../../../../decorators/apiSuccessResponse.decorator";
import { User } from "domains/social/user.domain";
import { HttpUserReq } from "decorators/user.decorator";
import { GetRolesResponse } from "modules/auth/useCases/getRoles/getRolesResponse";
import { PageOptionsDto } from "base/pageOptions.base";
import { ParseHttpRequestPipe } from "pipes/parseRequest.pipe";
import { GetRolesQuery } from "modules/auth/useCases/getRoles";
import { RequirePermissions } from "decorators/roles.decorator";

@Controller("roles")
@ApiTags("Roles")
@ApiBearerAuth()
@RequirePermissions("manage_role")
export class RoleController {
  constructor(private _queryBus: QueryBus) { }

  @Get()
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(GetRolesResponse, "Get roles successfully")
  async getFoods(
    @Query(new ParseHttpRequestPipe<typeof PageOptionsDto>())
    query: PageOptionsDto,
    @HttpUserReq() user: User
  ): Promise<Result<GetRolesResponse>> {
    const roleQuery = new GetRolesQuery(user, query);
    const result = await this._queryBus.execute(roleQuery);
    return Result.ok(result, {
      messages: ["Get roles successfully"],
    });
  }
}
