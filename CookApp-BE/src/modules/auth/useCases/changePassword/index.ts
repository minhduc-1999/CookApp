import { BadRequestException, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ResponseDTO } from "base/dtos/response.dto";
import { BaseCommand } from "base/cqrs/command.base";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { ChangePasswordRequest } from "./changePasswordRequest";
import { IAuthentication } from "modules/auth/services/authentication.service";
import { UserErrorCode } from "enums/errorCode.enum";
import { IAccountRepository } from "modules/auth/interfaces/repositories/account.interface";
import { User } from "domains/social/user.domain";

export class ChangePasswordCommand extends BaseCommand {
  req: ChangePasswordRequest;
  constructor(req: ChangePasswordRequest, tx: ITransaction, user: User) {
    super(tx, user);
    this.req = req;
  }
}
@CommandHandler(ChangePasswordCommand)
export class ChangePasswordCommandHandler
  implements ICommandHandler<ChangePasswordCommand>
{
  constructor(
    @Inject("IAuthentication")
    private _authService: IAuthentication,
    @Inject("IAccountRepository")
    private _accountRepo: IAccountRepository
  ) {}
  async execute(command: ChangePasswordCommand): Promise<void> {
    const { req, user, tx } = command;
    const oldPassMatch = await this._authService.verifyPassword(
      req.oldPassword,
      user.account.password
    );

    if (!oldPassMatch) {
      throw new BadRequestException(
        ResponseDTO.fail(
          "Old password is not correct",
          UserErrorCode.OLD_PASSWORD_NOT_CORRECT
        )
      );
    }

    const newHashedPassword = await this._authService.getHashedPassword(
      req.newPassword
    );

    await this._accountRepo.setTransaction(tx).update(user.account, {
      password: newHashedPassword,
    });

    return;
  }
}
