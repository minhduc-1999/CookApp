import { Body, Controller, HttpCode, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { Public } from "decorators/public.decorator";
import { LoginDTO } from "modules/auth/dtos/login.dto";
import { RegisterDTO } from "modules/auth/dtos/createUser.dto";
import { RegisterCommand } from "modules/auth/useCases/register";
import { Result } from "base/result.base";
import { BasicAuthGuard } from "guards/basic.guard";
import { LoginCommand } from "modules/auth/useCases/login";

@Controller()
@ApiTags("Authentication")
export class AuthController {
  constructor(private _commandBus: CommandBus) {}

  @Post("register")
  @Public()
  async register(@Body() body: RegisterDTO) {
    const registerCommand = new RegisterCommand(body);
    const result = await this._commandBus.execute(registerCommand);
    return Result.ok(result, { message: "Register successfully" });
  }

  @HttpCode(200)
  @UseGuards(BasicAuthGuard)
  @ApiBody({
    type: LoginDTO,
  })
  @Post("login")
  async login(@Req() req): Promise<any> {
    const loginCommand = new LoginCommand(req.user);
    const result = await this._commandBus.execute(loginCommand)
    return Result.ok(result, { message: "Login successfully" });
  }
}