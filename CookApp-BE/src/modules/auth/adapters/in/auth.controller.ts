import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { Public } from "decorators/public.decorator";
import { RegisterCommand } from "modules/auth/useCases/register";
import { Result } from "base/result.base";
import { BasicAuthGuard } from "guards/basic_auth.guard";
import { LoginCommand } from "modules/auth/useCases/login";
import { UserDTO } from "modules/auth/dtos/user.dto";
import {
  ApiFailResponseCustom,
  ApiCreatedResponseCustom,
  ApiOKResponseCustom,
  ApiBadReqResponseCustom,
} from "../../../../decorators/ApiSuccessResponse.decorator";
import { LoginRequest } from "modules/auth/useCases/login/loginRequest";
import { LoginResponse } from "modules/auth/useCases/login/loginResponse";
import { RegisterResponse } from "modules/auth/useCases/register/registerResponse";
import { RegisterRequest } from "modules/auth/useCases/register/registerRequest";

@Controller()
@ApiTags("Authentication")
export class AuthController {
  constructor(private _commandBus: CommandBus) {}

  @Post("register")
  @Public()
  @ApiFailResponseCustom()
  @ApiCreatedResponseCustom(RegisterResponse, "Register successfully")
  async register(@Body() body: RegisterRequest): Promise<Result<RegisterResponse>> {
    const registerCommand = new RegisterCommand(body);
    const user = (await this._commandBus.execute(registerCommand)) as UserDTO;
    return Result.ok(
      { id: user.id, username: user.username },
      { messages: ["Register successfully"] }
    );
  }

  @HttpCode(200)
  @UseGuards(BasicAuthGuard)
  @ApiBody({
    type: LoginRequest,
  })
  @Post("login")
  @ApiFailResponseCustom()
  @ApiBadReqResponseCustom("Username or password is not correct")
  @ApiOKResponseCustom(LoginResponse, "Login successfully")
  @Public()
  async login(@Req() req): Promise<Result<LoginResponse>> {
    const loginCommand = new LoginCommand(req.user);
    const result = await this._commandBus.execute(loginCommand);
    return Result.ok(result, { messages: ["Login successfully"] });
  }
}
