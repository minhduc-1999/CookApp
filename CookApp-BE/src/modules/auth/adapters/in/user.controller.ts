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
import { ProfileDTO, UpdateProfileDTO } from "modules/auth/dtos/profile.dto";
import { UserDTO } from "modules/auth/dtos/user.dto";
import { GetProfileQuery } from "modules/auth/useCases/getProfile";
import { UpdateProfileCommand } from "modules/auth/useCases/updateProfile";

@Controller("users")
@ApiTags("Authentication")
@ApiBearerAuth()
export class UserController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) {}

  @Get("profile")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(UserDTO, "Getting profile successfully")
  @ApiBadReqResponseCustom()
  async getProfile(@Req() req): Promise<Result<UserDTO>> {
    const query = new GetProfileQuery(req.user);
    const result = await this._queryBus.execute(query);
    return Result.ok(result, { messages: ["Getting profile successfully"] });
  }

  @Patch("profile")
  @ApiFailResponseCustom()
  @ApiOKResponseCustom(UserDTO, "Getting profile successfully")
  @ApiBadReqResponseCustom('Parameter type is not correct')
  async updateProfile(
    @Req() req,
    @Body() body: UpdateProfileDTO
  ): Promise<Result<UserDTO>> {
    const command = new UpdateProfileCommand(req.user, body);
    const result = await this._commandBus.execute(command);
    return Result.ok(result, { messages: ["Updating profile successfully"] });
  }
}
