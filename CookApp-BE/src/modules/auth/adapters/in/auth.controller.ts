import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "decorators/public.decorator";
import { LoginDTO } from "modules/auth/dtos/login.dto";
import { RegisterDTO } from "modules/auth/dtos/createUser.dto";
import { RegisterCommand } from "modules/auth/useCases/register";
import MongooseClassSerializerInterceptor from "interceptors/mongooseClassSerializer.interceptor";
import { User } from "modules/auth/domains/schemas/user.schema";

@Controller()
@ApiTags("Authentication")
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class AuthController {
  constructor(private _commandBus: CommandBus) {}

  @Post("register")
  @Public()
  async register(@Body() body: RegisterDTO) {
    const registerCommand = new RegisterCommand(body);
    return await this._commandBus.execute(registerCommand);
  }

  @Post("login")
  async login(@Body() body: LoginDTO): Promise<any> {
    return "login";
  }
}