import { Body, Controller, Get, Patch, Req } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Result } from "base/result.base";
import {
  ApiFailResponseCustom,
  ApiOKResponseCustom,
} from "decorators/ApiSuccessResponse.decorator";
import { User } from "decorators/user.decorator";
import { UserDTO } from "dtos/social/user.dto";
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
  async getProfile(@User() user: UserDTO): Promise<Result<GetProfileResponse>> {
    const query = new GetProfileQuery(user);
    const result = await this._queryBus.execute(query);
    return Result.ok(result, { messages: ["Getting profile successfully"] });
  }

  @Patch("profile")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(UpdateProfileResponse, "Getting profile successfully")
  async updateProfile(
    @User() user: UserDTO,
    @Body() body: UpdateProfileRequest
  ): Promise<Result<UpdateProfileResponse>> {
    const command = new UpdateProfileCommand(null, user, body);
    const result = await this._commandBus.execute(command);
    return Result.ok(result, { messages: ["Updating profile successfully"] });
  }
}
