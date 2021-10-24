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
import { LoginDTO, LoginResponseDto } from "modules/auth/dtos/login.dto";
import { RegisterCommand } from "modules/auth/useCases/register";
import { Result } from "base/result.base";
import { BasicAuthGuard } from "guards/basic_auth.guard";
import { LoginCommand } from "modules/auth/useCases/login";
import { UserDTO } from "modules/auth/dtos/user.dto";
import { RegisterDTO } from "modules/auth/dtos/register.dto";
import {
  ApiFailResponseCustom,
  ApiCreatedResponseCustom,
  ApiOKResponseCustom,
  ApiBadReqResponseCustom,
} from "../../../../decorators/ApiSuccessResponse.decorator";

@Controller()
@ApiTags("Authentication")
export class AuthController {
  constructor(private _commandBus: CommandBus) {}

  @Post("register")
  @Public()
  @ApiFailResponseCustom()
  @ApiCreatedResponseCustom(UserDTO, "Register successfully")
  async register(@Body() body: RegisterDTO): Promise<Result<UserDTO>> {
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
    type: LoginDTO,
  })
  @Post("login")
  @ApiFailResponseCustom()
  @ApiBadReqResponseCustom("Username or password is not correct")
  @ApiOKResponseCustom(LoginResponseDto, "Login successfully")
  @Public()
  async login(@Req() req): Promise<Result<LoginResponseDto>> {
    const loginCommand = new LoginCommand(req.user);
    const result = await this._commandBus.execute(loginCommand);
    return Result.ok(result, { messages: ["Login successfully"] });
  }
}
