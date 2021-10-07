import { Body, Controller, HttpCode, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { Public } from "decorators/public.decorator";
import { LoginDTO } from "modules/auth/dtos/login.dto";
import { RegisterDTO } from "modules/auth/dtos/createUser.dto";
import { RegisterCommand } from "modules/auth/useCases/register";
import MongooseClassSerializerInterceptor from "interceptors/mongooseClassSerializer.interceptor";
import { User } from "modules/auth/domains/schemas/user.schema";
import { Result } from "base/result.base";
import { BasicAuthGuard } from "guards/basic.guard";
import { ConvertResponse } from "interceptors/convert-response.service";

@Controller()
@ApiTags("Authentication")
export class AuthController {
  constructor(private _commandBus: CommandBus) {}

  @Post("register")
  @Public()
  @UseInterceptors(MongooseClassSerializerInterceptor(User))
  async register(@Body() body: RegisterDTO) {
    const registerCommand = new RegisterCommand(body);
    const result = await this._commandBus.execute(registerCommand);
    return Result.ok(result, { message: "Register successfully" });
  }

  @HttpCode(200)
  @UseGuards(BasicAuthGuard)
  @UseInterceptors(MongooseClassSerializerInterceptor(User), ConvertResponse)
  @ApiBody({
    type: LoginDTO,
  })
  @Post("login")
  async login(@Req() req): Promise<any> {
    return Result.ok(req.user, { message: "Login successfully" });
  }
}