import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IMailService } from "modules/share/adapters/out/services/mail.service";
import { IUserRepository } from "modules/auth/interfaces/repositories/user.interface";
import { UtilsService } from "providers/utils.service";
import { RequestResetPasswordRequest } from "./requestResetPasswordRequest";
import { IAccountRepository } from "modules/auth/interfaces/repositories/account.interface";
import { ResponseDTO } from "base/dtos/response.dto";
import { UserErrorCode } from "enums/errorCode.enum";
import { BaseCommand } from "base/cqrs/command.base";
import { ITransaction } from "adapters/typeormTransaction.adapter";

export const RESET_PASSWORD_TOKEN_LENGTH = 24;

export class RequestResetPasswordCommand extends BaseCommand {
  requestDto: RequestResetPasswordRequest;
  constructor(requestDto: RequestResetPasswordRequest, tx: ITransaction) {
    super(tx, null);
    this.requestDto = requestDto;
  }
}
@CommandHandler(RequestResetPasswordCommand)
export class RequestResetPasswordQueryHandler
  implements ICommandHandler<RequestResetPasswordCommand>
{
  constructor(
    @Inject("IMailService")
    private _mailService: IMailService,
    @Inject("IUserRepository")
    private _userRepo: IUserRepository,
    @Inject("IAccountRepository")
    private _accountRepo: IAccountRepository
  ) {}
  async execute(command: RequestResetPasswordCommand): Promise<void> {
    const { requestDto, tx } = command;
    const user = await this._userRepo.getUserByEmail(requestDto.email);
    if (!user) {
      throw new NotFoundException(
        ResponseDTO.fail("User not found", UserErrorCode.USER_NOT_FOUND)
      );
    }
    const resetToken = UtilsService.generateUniqueCode(
      RESET_PASSWORD_TOKEN_LENGTH
    );
    const { account } = user;
    await this._accountRepo
      .setTransaction(tx)
      .update(account, { resetPasswordToken: resetToken });
    account.resetPasswordToken = resetToken;
    this._mailService.sendEmailResetPassword(account);
    return;
  }
}
