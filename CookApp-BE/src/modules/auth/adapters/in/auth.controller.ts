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
import { LoginCommand } from "modules/auth/useCases/login";
import {
  ApiFailResponseCustom,
  ApiCreatedResponseCustom,
  ApiOKResponseCustom,
  ApiOKResponseCustomWithoutData,
} from "../../../../decorators/apiSuccessResponse.decorator";
import { LoginRequest } from "modules/auth/useCases/login/loginRequest";
import { LoginResponse } from "modules/auth/useCases/login/loginResponse";
import { RegisterResponse } from "modules/auth/useCases/register/registerResponse";
import { RegisterRequest } from "modules/auth/useCases/register/registerRequest";
import { User } from "domains/social/user.domain";
import { ParamTransaction, RequestTransaction } from "decorators/transaction.decorator";
import { UserReq } from "decorators/user.decorator";
import { GoogleSignInRequest } from "modules/auth/useCases/loginWithGoogle/googleSignInRequest";
import { GoogleSignInCommand } from "modules/auth/useCases/loginWithGoogle";
import { GoogleSignInResponse } from "modules/auth/useCases/loginWithGoogle/googleSignInResponse";
import { VerifyEmailRequest } from "modules/auth/useCases/verifyEmail/verifyEmailRequest";
import { VerifyEmailCommand } from "modules/auth/useCases/verifyEmail";
import { ResendEmailVerificationRequest } from "modules/auth/useCases/resendEmailVerification/resendEmailVerificationRequest";
import { ResendEmailVerificationCommand } from "modules/auth/useCases/resendEmailVerification";
import { Transaction } from "neo4j-driver";
import { NotRequireEmailVerification } from "decorators/notRequireEmailVerification.decorator";
import { BasicAuthGuard } from "guards/basicAuth.guard";

@Controller()
@ApiTags("Authentication")
export class AuthController {
  constructor(private _commandBus: CommandBus) { }

  @Post("register")
  @Public()
  @NotRequireEmailVerification()
  @ApiFailResponseCustom()
  @ApiCreatedResponseCustom(RegisterResponse, "Register successfully")
  @ApiConflictResponse()
  @RequestTransaction()
  async register(
    @Body() body: RegisterRequest,
    @ParamTransaction() tx: Transaction
  ): Promise<Result<RegisterResponse>> {
    const registerCommand = new RegisterCommand(body, tx);
    const user = (await this._commandBus.execute(registerCommand)) as User;
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
  async login(@UserReq() user: User): Promise<Result<LoginResponse>> {
    const loginCommand = new LoginCommand(null, user);
    const result = await this._commandBus.execute(loginCommand);
    return Result.ok(result, { messages: ["Login successfully"] });
  }

  @Post("google/callback")
  @HttpCode(200)
  @Public()
  @NotRequireEmailVerification()
  @ApiOKResponseCustom(GoogleSignInResponse, "Authenticate successfully")
  @RequestTransaction()
  async loginWithGoogleCallback(
    @Body() body: GoogleSignInRequest,
    @ParamTransaction() tx: Transaction
  ): Promise<Result<GoogleSignInResponse>> {
    let command = new GoogleSignInCommand(tx, body);
    const jwt = await this._commandBus.execute(command);
    return Result.ok(jwt, { messages: ["Authenticate successfully"] });
  }

  @Post("email-verification/callback")
  @Public()
  @NotRequireEmailVerification()
  @ApiOkResponse({ description: "Confirm email successfully" })
  @RequestTransaction()
  async verifyEmailCallback(
    @Body() body: VerifyEmailRequest,
    @ParamTransaction() tx: Transaction
  ): Promise<string> {
    let command = new VerifyEmailCommand(body, tx);
    await this._commandBus.execute(command);
    return "Confirm email successfully";
  }

  @Post("resend-email-verification")
  @ApiBearerAuth()
  @NotRequireEmailVerification()
  @ApiOKResponseCustomWithoutData("Resend email verification successfully")
  async resendEmailVerificationCallback(
    @Body() body: ResendEmailVerificationRequest,
    @UserReq() user: User
  ): Promise<Result<void>> {
    let command = new ResendEmailVerificationCommand(body, user, null);
    await this._commandBus.execute(command);
    return Result.ok(null, {
      messages: ["Resend email verification successfully"],
    });
  }
}
