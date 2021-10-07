import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "decorators/public.decorator";
import { Result } from "base/result.base";
import { ProfileDTO, UpdateProfileDTO } from "modules/auth/dtos/profile.dto";
import { GetProfileQuery } from "modules/auth/useCases/getProfile";
import { UpdateProfileCommand } from "modules/auth/useCases/updateProfile";

@Controller("users")
@ApiTags("Authentication")
export class UserController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) {}

  @Get("profile")
  @Public()
  async getProfile(@Req() req) {
    const query = new GetProfileQuery(req.user);
    const result = (await this._queryBus.execute(query));
    return Result.ok(
      result,
      { message: "Getting profile successfully" }
    );
  }

  @Patch("profile")
  @Public()
  async updateProfile(@Req() req, @Body() body: UpdateProfileDTO) {
    const command = new UpdateProfileCommand(req.user, body);
    const result = (await this._commandBus.execute(command));
    return Result.ok(
      result,
      { message: "Updating profile successfully" }
    );
  }
}
