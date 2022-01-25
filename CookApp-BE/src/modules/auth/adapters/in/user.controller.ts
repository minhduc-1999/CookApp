import { Body, Controller, Get, Patch } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiConflictResponse, ApiTags } from "@nestjs/swagger";
import { Result } from "base/result.base";
import {
  ApiFailResponseCustom,
  ApiOKResponseCustom,
  ApiOKResponseCustomWithoutData,
} from "decorators/apiSuccessResponse.decorator";
import { ParamTransaction, RequestTransaction } from "decorators/transaction.decorator";
import { UserReq } from "decorators/user.decorator";
import { User } from "domains/social/user.domain";
import { GetProfileQuery } from "modules/auth/useCases/getProfile";
import { GetProfileResponse } from "modules/auth/useCases/getProfile/getProfileResponse";
import { UpdateProfileCommand } from "modules/auth/useCases/updateProfile";
import { UpdateProfileRequest } from "modules/auth/useCases/updateProfile/updateProfileRequest";
import { Transaction } from "neo4j-driver";

@Controller("users")
@ApiTags("Authentication")
@ApiBearerAuth()
export class UserController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) {}

  @Get("profile")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(GetProfileResponse, "Getting profile successfully")
  async getProfile(@UserReq() user: User): Promise<Result<GetProfileResponse>> {
    const query = new GetProfileQuery(user);
    const result = await this._queryBus.execute(query);
    return Result.ok(result, { messages: ["Getting profile successfully"] });
  }

  @Patch("profile")
  @ApiFailResponseCustom()
  @ApiConflictResponse()
  @ApiOKResponseCustomWithoutData("Updating profile successfully")
  @RequestTransaction()
  async updateProfile(
    @UserReq() user: User,
    @Body() body: UpdateProfileRequest,
    @ParamTransaction() tx: Transaction 
  ): Promise<Result<void>> {
    const command = new UpdateProfileCommand(tx, user, body);
    await this._commandBus.execute(command);
    return Result.ok(null, { messages: ["Updating profile successfully"] });
  }
}
