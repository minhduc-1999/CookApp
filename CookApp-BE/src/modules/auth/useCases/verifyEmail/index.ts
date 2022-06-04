import { BadRequestException, Inject, NotAcceptableException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BaseCommand } from "base/cqrs/command.base";
import { VerifyEmailRequest } from "./verifyEmailRequest";
import { ResponseDTO } from "base/dtos/response.dto";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { IAccountRepository } from "modules/auth/interfaces/repositories/account.interface";
import { User } from "domains/social/user.domain";

export class VerifyEmailCommand extends BaseCommand {
  requestDto: VerifyEmailRequest;
  constructor(requestDto: VerifyEmailRequest, tx: ITransaction, user: User) {
    super(tx, user);
    this.requestDto = requestDto;
  }
}
@CommandHandler(VerifyEmailCommand)
export class VerifyEmailCommandHandler
  implements ICommandHandler<VerifyEmailCommand>
{
  constructor(
    @Inject("IAccountRepository") private _accountRepo: IAccountRepository
  ) {}
  async execute(command: VerifyEmailCommand): Promise<void> {
    const { tx, requestDto, user } = command;
    const { account } = user;
    if (account.emailVerified) {
      throw new BadRequestException(
        ResponseDTO.fail("Email has already been verified")
      );
    }
    if (account.verifyEmailCode !== requestDto.code) {
      throw new NotAcceptableException();
    }
    account.verify();
    await this._accountRepo.setTransaction(tx).update(account, account);
    return;
  }
}
