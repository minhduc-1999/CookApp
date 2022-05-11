import { Body, Controller, Get, Patch, Query } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiConflictResponse, ApiTags } from "@nestjs/swagger";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PageOptionsDto } from "base/pageOptions.base";
import { Result } from "base/result.base";
import {
  ApiFailResponseCustom,
  ApiOKResponseCustom,
  ApiOKResponseCustomWithoutData,
} from "decorators/apiSuccessResponse.decorator";
import { RequirePermissions } from "decorators/roles.decorator";
import { HttpParamTransaction, HttpRequestTransaction } from "decorators/transaction.decorator";
import { HttpUserReq } from "decorators/user.decorator";
import { User } from "domains/social/user.domain";
import { GetProfileQuery } from "modules/user/useCases/getProfile";
import { GetProfileResponse } from "modules/user/useCases/getProfile/getProfileResponse";
import { GetUsersQuery } from "modules/user/useCases/getUsers";
import { GetUsersResponse } from "modules/user/useCases/getUsers/getUsersResponse";
import { UpdateProfileCommand } from "modules/user/useCases/updateProfile";
import { UpdateProfileRequest } from "modules/user/useCases/updateProfile/updateProfileRequest";
import { ParseHttpRequestPipe } from "pipes/parseRequest.pipe";

@Controller("users")
@ApiTags("Users")
@ApiBearerAuth()
@RequirePermissions("manage_user")
export class UserController {
  constructor(
    private _queryBus: QueryBus,
    private _commandBus: CommandBus) { }

  @Get()
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(GetUsersResponse, "Get users successfully")
  @RequirePermissions("read_user")
  async findUsers(
    @Query(new ParseHttpRequestPipe<typeof PageOptionsDto>()) query: PageOptionsDto,
    @HttpUserReq() user: User
  ): Promise<Result<GetUsersResponse>> {
    const queryOp = new GetUsersQuery(user, query);
    const result = await this._queryBus.execute(queryOp);
    return Result.ok(result, {
      messages: ["Get users successfully"],
    });
  }

  @Get("profile")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(GetProfileResponse, "Getting profile successfully")
  @RequirePermissions("read_user")
  async getProfile(@HttpUserReq() user: User): Promise<Result<GetProfileResponse>> {
    const query = new GetProfileQuery(user);
    const result = await this._queryBus.execute(query);
    return Result.ok(result, { messages: ["Getting profile successfully"] });
  }

  @Patch("profile")
  @ApiFailResponseCustom()
  @ApiConflictResponse()
  @ApiOKResponseCustomWithoutData("Updating profile successfully")
  @HttpRequestTransaction()
  @RequirePermissions("read_user")
  async updateProfile(
    @HttpUserReq() user: User,
    @Body() body: UpdateProfileRequest,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<void>> {
    const command = new UpdateProfileCommand(tx, user, body);
    await this._commandBus.execute(command);
    return Result.ok(null, { messages: ["Updating profile successfully"] });
  }
}
