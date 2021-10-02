import { Body, Controller, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "decorators/public.decorator";
import { LoginDTO } from "modules/auth/dtos/login.dto";

@Controller()
@ApiTags("Authentication")
export class AuthController {
    constructor(private _commandBus: CommandBus) {}

    @Post("register")
    @Public()
    async register() {
        return "register"
    }

    @Post("login")
    async login(@Body() body: LoginDTO): Promise<any> {
        return "login"
    }
}