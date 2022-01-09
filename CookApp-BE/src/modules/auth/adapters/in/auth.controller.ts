import { Body, Controller, HttpCode, Post, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Public } from "decorators/public.decorator";
import { RegisterCommand } from "modules/auth/useCases/register";
import { Result } from "base/result.base";
import { BasicAuthGuard } from "guards/basic_auth.guard";
import { LoginCommand } from "modules/auth/useCases/login";
import {
  ApiFailResponseCustom,
  ApiCreatedResponseCustom,
  ApiOKResponseCustom,
  ApiOKResponseCustomWithoutData,
} from "../../../../decorators/ApiSuccessResponse.decorator";
import { LoginRequest } from "modules/auth/useCases/login/loginRequest";
import { LoginResponse } from "modules/auth/useCases/login/loginResponse";
import { RegisterResponse } from "modules/auth/useCases/register/registerResponse";
import { RegisterRequest } from "modules/auth/useCases/register/registerRequest";
import { UserDTO } from "dtos/social/user.dto";
import { Transaction } from "decorators/transaction.decorator";
import { MongooseSession } from "decorators/mongooseSession.decorator";
import { ClientSession } from "mongoose";
import { User } from "decorators/user.decorator";
import { GoogleSignInRequest } from "modules/auth/useCases/loginWithGoogle/googleSignInRequest";
import { GoogleSignInCommand } from "modules/auth/useCases/loginWithGoogle";
import { GoogleSignInResponse } from "modules/auth/useCases/loginWithGoogle/googleSignInResponse";
import { VerifyEmailRequest } from "modules/auth/useCases/verifyEmail/verifyEmailRequest";
import { VerifyEmailCommand } from "modules/auth/useCases/verifyEmail";
import { ResendEmailVerificationRequest } from "modules/auth/useCases/resendEmailVerification/resendEmailVerificationRequest";
import { ResendEmailVerificationCommand } from "modules/auth/useCases/resendEmailVerification";
import { NotRequireEmailVerification } from "decorators/not_require_email_verification.decorator";

@Controller()
@ApiTags("Authentication")
export class AuthController {
  constructor(private _commandBus: CommandBus) {}

  @Post("register")
  @Public()
  @NotRequireEmailVerification()
  @ApiFailResponseCustom()
  @ApiCreatedResponseCustom(RegisterResponse, "Register successfully")
  @ApiConflictResponse()
  @Transaction()
  async register(
    @Body() body: RegisterRequest,
    @MongooseSession() session: ClientSession
  ): Promise<Result<RegisterResponse>> {
    const registerCommand = new RegisterCommand(body, session);
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
  @ApiOKResponseCustom(LoginResponse, "Login successfully")
  @Public()
  @NotRequireEmailVerification()
  async login(@User() user: UserDTO): Promise<Result<LoginResponse>> {
    const loginCommand = new LoginCommand(null, user);
    const result = await this._commandBus.execute(loginCommand);
    return Result.ok(result, { messages: ["Login successfully"] });
  }

  @Post("google/callback")
  @HttpCode(200)
  @Public()
  @NotRequireEmailVerification()
  @ApiOKResponseCustom(GoogleSignInResponse, "Authenticate successfully")
  async loginWithGoogleCallback(
    @Body() body: GoogleSignInRequest
  ): Promise<Result<GoogleSignInResponse>> {
    let command = new GoogleSignInCommand(null, body);
    const jwt = await this._commandBus.execute(command);
    return Result.ok(jwt, { messages: ["Authenticate successfully"] });
  }

  @Post("email-verification/callback")
  @Public()
  @NotRequireEmailVerification()
  @ApiOkResponse({ description: "Confirm email successfully" })
  async verifyEmailCallback(@Body() body: VerifyEmailRequest): Promise<string> {
    let command = new VerifyEmailCommand(body, null);
    await this._commandBus.execute(command);
    return "Confirm email successfully";
  }

  @Post("resend-email-verification")
  @ApiBearerAuth()
  @NotRequireEmailVerification()
  @ApiOKResponseCustomWithoutData("Resend email verification successfully")
  async resendEmailVerificationCallback(
    @Body() body: ResendEmailVerificationRequest,
    @User() user: UserDTO
  ): Promise<Result<void>> {
    let command = new ResendEmailVerificationCommand(body, user, null);
    await this._commandBus.execute(command);
    return Result.ok(null, {
      messages: ["Resend email verification successfully"],
    });
  }
}
