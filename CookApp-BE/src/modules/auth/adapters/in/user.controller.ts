import { Body, Controller, Get, Patch } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiConflictResponse, ApiTags } from "@nestjs/swagger";
import { Result } from "base/result.base";
import {
  ApiFailResponseCustom,
  ApiOKResponseCustom,
  ApiOKResponseCustomWithoutData,
} from "decorators/ApiSuccessResponse.decorator";
import { ParamTransaction, RequestTransaction } from "decorators/transaction.decorator";
import { User } from "decorators/user.decorator";
import { UserDTO } from "dtos/social/user.dto";
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
  async getProfile(@User() user: UserDTO): Promise<Result<GetProfileResponse>> {
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
    @User() user: UserDTO,
    @Body() body: UpdateProfileRequest,
    @ParamTransaction() tx: Transaction 
  ): Promise<Result<void>> {
    const command = new UpdateProfileCommand(tx, user, body);
    await this._commandBus.execute(command);
    return Result.ok(null, { messages: ["Updating profile successfully"] });
  }
}
