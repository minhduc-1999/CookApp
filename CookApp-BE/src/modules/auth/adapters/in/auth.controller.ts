import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Query,
  Render,
  UseGuards,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
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
import {
  HttpParamTransaction,
  HttpRequestTransaction,
} from "decorators/transaction.decorator";
import { HttpUserReq } from "decorators/user.decorator";
import { VerifyEmailRequest } from "modules/auth/useCases/verifyEmail/verifyEmailRequest";
import { VerifyEmailCommand } from "modules/auth/useCases/verifyEmail";
import { ResendEmailVerificationRequest } from "modules/auth/useCases/resendEmailVerification/resendEmailVerificationRequest";
import { ResendEmailVerificationCommand } from "modules/auth/useCases/resendEmailVerification";
import { NotRequireEmailVerification } from "decorators/notRequireEmailVerification.decorator";
import { BasicAuthGuard } from "guards/basicAuth.guard";
import { GoogleAuthGuard } from "guards/jwtAuth.guard";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { ChangePasswordRequest } from "modules/auth/useCases/changePassword/changePasswordRequest";
import { ChangePasswordCommand } from "modules/auth/useCases/changePassword";
import { RequestResetPasswordCommand } from "modules/auth/useCases/requestResetPassword";
import { RequestResetPasswordRequest } from "modules/auth/useCases/requestResetPassword/requestResetPasswordRequest";
import { ResetPasswordRequest } from "modules/auth/useCases/resetPassword/resetPasswordRequest";
import { ResetPasswordCommand } from "modules/auth/useCases/resetPassword";
import { GetResetPasswordResponse } from "modules/auth/useCases/getResetPasswordInfo/getResetPasswordInfo.response";
import { GetResetPasswordQuery } from "modules/auth/useCases/getResetPasswordInfo";
import { GetResetPasswordInfoRequest } from "modules/auth/useCases/getResetPasswordInfo/getResetPasswordInfo.request";

@Controller()
@ApiTags("Authentication")
export class AuthController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) {}

  @Post("register")
  @Public()
  @NotRequireEmailVerification()
  @ApiFailResponseCustom()
  @ApiCreatedResponseCustom(RegisterResponse, "Register successfully")
  @ApiConflictResponse()
  @HttpRequestTransaction()
  async register(
    @Body() body: RegisterRequest,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<RegisterResponse>> {
    const registerCommand = new RegisterCommand(body, tx);
    const user = (await this._commandBus.execute(registerCommand)) as User;
    return Result.ok({ id: user.id }, { messages: ["Register successfully"] });
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
  async login(@HttpUserReq() user: User): Promise<Result<LoginResponse>> {
    const loginCommand = new LoginCommand(null, user);
    const result = await this._commandBus.execute(loginCommand);
    return Result.ok(result, { messages: ["Login successfully"] });
  }

  @Get("google")
  @Public()
  @NotRequireEmailVerification()
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get("google/redirect")
  @UseGuards(GoogleAuthGuard)
  @Public()
  @NotRequireEmailVerification()
  @ApiOKResponseCustom(LoginResponse, "Login successfully")
  async googleAuthRedirect(@HttpUserReq() user: User) {
    const loginCommand = new LoginCommand(null, user);
    const result = await this._commandBus.execute(loginCommand);
    return Result.ok(result, { messages: ["Login successfully"] });
  }

  @Put("password/change")
  @ApiOKResponseCustomWithoutData("Change password successfully")
  @HttpRequestTransaction()
  @ApiBearerAuth()
  async changePassword(
    @Body() body: ChangePasswordRequest,
    @HttpParamTransaction() tx: ITransaction,
    @HttpUserReq() user: User
  ): Promise<Result<void>> {
    let command = new ChangePasswordCommand(body, tx, user);
    await this._commandBus.execute(command);
    return Result.ok(null, { messages: ["Change password successfully"] });
  }

  @Post("email-verification/callback")
  @Public()
  @NotRequireEmailVerification()
  @ApiOkResponse({ description: "Confirm email successfully" })
  @HttpRequestTransaction()
  async verifyEmailCallback(
    @Body() body: VerifyEmailRequest,
    @HttpParamTransaction() tx: ITransaction
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
    @HttpUserReq() user: User
  ): Promise<Result<void>> {
    let command = new ResendEmailVerificationCommand(body, user, null);
    await this._commandBus.execute(command);
    return Result.ok(null, {
      messages: ["Resend email verification successfully"],
    });
  }

  @Post("password/reset")
  @Public()
  @NotRequireEmailVerification()
  @ApiOKResponseCustomWithoutData(
    "Send reset password email verification successfully"
  )
  @HttpRequestTransaction()
  async resetPassword(
    @Body()
    body: RequestResetPasswordRequest,
    @HttpParamTransaction()
    tx: ITransaction
  ): Promise<Result<void>> {
    let resetPassCommand = new RequestResetPasswordCommand(body, tx);
    await this._commandBus.execute(resetPassCommand);
    return Result.ok(null, {
      messages: ["Send reset password email verification successfully"],
    });
  }

  @Get("reset-password")
  @Public()
  @NotRequireEmailVerification()
  @Render("resetPassword")
  async getResetPasswordPage(
    @Query() search: GetResetPasswordInfoRequest
  ): Promise<{ token: string; callback: string; username: string }> {
    const query = new GetResetPasswordQuery(search);
    const res = await this._queryBus.execute<
      GetResetPasswordQuery,
      GetResetPasswordResponse
    >(query);
    return {
      token: res.token,
      callback: res.callback,
      username: res.username,
    };
  }

  @Post("password/reset/callback")
  @Public()
  @NotRequireEmailVerification()
  @HttpRequestTransaction()
  async resetPasswordCallback(
    @Body() body: ResetPasswordRequest,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<void>> {
    let command = new ResetPasswordCommand(body, tx);
    await this._commandBus.execute(command);
    return Result.ok(null, {
      messages: ["Reset password successfully"],
    });
  }
}
