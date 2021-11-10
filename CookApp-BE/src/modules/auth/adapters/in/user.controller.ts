import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Result } from "base/result.base";
import { ApiBadReqResponseCustom, ApiFailResponseCustom, ApiOKResponseCustom } from "decorators/ApiSuccessResponse.decorator";
import { UserDTO } from "modules/auth/dtos/user.dto";
import { GetProfileQuery } from "modules/auth/useCases/getProfile";
import { GetProfileResponse } from "modules/auth/useCases/getProfile/getProfileResponse";
import { UpdateProfileCommand } from "modules/auth/useCases/updateProfile";
import { UpdateProfileRequest } from "modules/auth/useCases/updateProfile/updateProfileRequest";
import { UpdateProfileResponse } from "modules/auth/useCases/updateProfile/updateProfileResponse";

@Controller("users")
@ApiTags("Authentication")
@ApiBearerAuth()
export class UserController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) {}

  @Get("profile")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(GetProfileResponse, "Getting profile successfully")
  @ApiBadReqResponseCustom()
  async getProfile(@Req() req): Promise<Result<GetProfileResponse>> {
    const query = new GetProfileQuery(req.user);
    const result = await this._queryBus.execute(query);
    return Result.ok(result, { messages: ["Getting profile successfully"] });
  }

  @Patch("profile")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(UpdateProfileResponse, "Getting profile successfully")
  @ApiBadReqResponseCustom("Parameter type is not correct")
  async updateProfile(
    @Req() req,
    @Body() body: UpdateProfileRequest
  ): Promise<Result<UpdateProfileResponse>> {
    const command = new UpdateProfileCommand(req.user, body);
    const result = await this._commandBus.execute(command);
    return Result.ok(result, { messages: ["Updating profile successfully"] });
  }
}
