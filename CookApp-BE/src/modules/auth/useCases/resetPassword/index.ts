import { ForbiddenException, Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IUserRepository } from "modules/auth/interfaces/repositories/user.interface";
import { BaseCommand } from "base/cqrs/command.base";
import { ResetPasswordRequest } from "./resetPasswordRequest";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { ResponseDTO } from "base/dtos/response.dto";
import { UserErrorCode } from "enums/errorCode.enum";
import { IAuthentication } from "modules/auth/services/authentication.service";
import { IAccountRepository } from "modules/auth/interfaces/repositories/account.interface";

export class ResetPasswordCommand extends BaseCommand {
  requestDto: ResetPasswordRequest;
  constructor(requestDto: ResetPasswordRequest, tx: ITransaction) {
    super(tx, null);
    this.requestDto = requestDto;
  }
}
@CommandHandler(ResetPasswordCommand)
export class ResetPasswordCommandHandler
  implements ICommandHandler<ResetPasswordCommand>
{
  constructor(
    @Inject("IUserRepository")
    private _userRepo: IUserRepository,
    @Inject("IAuthentication")
    private _authService: IAuthentication,
    @Inject("IAccountRepository")
    private _accountRepo: IAccountRepository
  ) {}
  async execute(command: ResetPasswordCommand): Promise<void> {
    const {
      requestDto: { token, newPassword, username },
      tx,
    } = command;
    const user = await this._userRepo.getUserByUsername(username);
    const { account } = user;
    if (!user) {
      throw new NotFoundException(
        ResponseDTO.fail("User not found", UserErrorCode.USER_NOT_FOUND)
      );
    }
    if (account.resetPasswordToken !== token) {
      throw new ForbiddenException(
        ResponseDTO.fail("Not allow to reset password")
      );
    }
    const newHashedPass = await this._authService.getHashedPassword(
      newPassword
    );
    account.changPassword(newHashedPass);
    await this._accountRepo.setTransaction(tx).update(account, account);
    return;
  }
}
