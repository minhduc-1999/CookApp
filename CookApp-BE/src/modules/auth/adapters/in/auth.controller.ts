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
import { ChangeRoleRequest } from "modules/auth/useCases/changeRole/changeRoleRequest";
import { RequirePermissions } from "decorators/roles.decorator";
import { ChangeRoleCommand } from "modules/auth/useCases/changeRole";
import { ParseHttpRequestPipe } from "pipes/parseRequest.pipe";
import { PageOptionsDto } from "base/pageOptions.base";
import { GetUsersQuery } from "modules/auth/useCases/getUsers";
import { GetUsersResponse } from "modules/auth/useCases/getUsers/getUsersResponse";
import { CreateUserRequest } from "modules/auth/useCases/createUser/createUserRequest";
import { CreateUserCommand } from "modules/auth/useCases/createUser";

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
  @NotRequireEmailVerification()
  @ApiOkResponse({ description: "Verify email successfully" })
  @HttpRequestTransaction()
  @ApiBearerAuth()
  async verifyEmailCallback(
    @Body() body: VerifyEmailRequest,
    @HttpParamTransaction() tx: ITransaction,
    @HttpUserReq() user: User
  ): Promise<Result<void>> {
    let command = new VerifyEmailCommand(body, tx, user);
    await this._commandBus.execute(command);
    return Result.ok(null, {
      messages: ["Verify email successfully"],
    });
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

  @Put("admin/change-role")
  @ApiOKResponseCustomWithoutData("Change role successfully")
  @RequirePermissions("manage_role")
  @ApiBearerAuth()
  async changeRole(@Body() body: ChangeRoleRequest) {
    const command = new ChangeRoleCommand(body, null, null);
    await this._commandBus.execute(command);
    return Result.ok(null, { messages: ["Change role successfully"] });
  }

  @Post("admin/users")
  @ApiFailResponseCustom()
  @ApiCreatedResponseCustom(RegisterResponse, "Create user successfully")
  @HttpRequestTransaction()
  @RequirePermissions("manage_user")
  @ApiBearerAuth()
  async createPost(
    @Body() body: CreateUserRequest,
    @HttpUserReq() user: User,
    @HttpParamTransaction() tx: ITransaction
  ): Promise<Result<RegisterResponse>> {
    const createUserCommand = new CreateUserCommand(body, tx, user);
    const createdPost = await this._commandBus.execute(createUserCommand);
    return Result.ok(createdPost, { messages: ["Create user successfully"] });
  }

  @Get("admin/users")
  @RequirePermissions("manage_user")
  @ApiOKResponseCustom(GetUsersResponse, "Get users successfully")
  @ApiBearerAuth()
  async getUser(
    @Query(new ParseHttpRequestPipe<typeof PageOptionsDto>())
    query: PageOptionsDto
  ) {
    const getUserQuery = new GetUsersQuery(null, query);
    const result = await this._queryBus.execute(getUserQuery);
    return Result.ok(result, { messages: ["Get users successfully"] });
  }
}
