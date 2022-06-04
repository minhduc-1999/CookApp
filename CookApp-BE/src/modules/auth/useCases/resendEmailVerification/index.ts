import {
  BadRequestException,
  ForbiddenException,
  Inject,
} from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BaseCommand } from "base/cqrs/command.base";
import { ResendEmailVerificationRequest } from "./resendEmailVerificationRequest";
import { IMailService } from "modules/share/adapters/out/services/mail.service";
import { ResponseDTO } from "base/dtos/response.dto";
import { User } from "domains/social/user.domain";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { UtilsService } from "providers/utils.service";
import { EMAIL_VERIFICATION_CODE_LENGTH } from "modules/auth/constants";
import { IAccountRepository } from "modules/auth/interfaces/repositories/account.interface";

export class ResendEmailVerificationCommand extends BaseCommand {
  requestDto: ResendEmailVerificationRequest;
  constructor(
    requestDto: ResendEmailVerificationRequest,
    user: User,
    tx: ITransaction
  ) {
    super(tx, user);
    this.requestDto = requestDto;
  }
}
@CommandHandler(ResendEmailVerificationCommand)
export class ResendEmailVerificationCommandHandler
  implements ICommandHandler<ResendEmailVerificationCommand>
{
  constructor(
    @Inject("IMailService")
    private _mailService: IMailService,
    @Inject("IAccountRepository")
    private _accountRepo: IAccountRepository
  ) {}
  async execute(command: ResendEmailVerificationCommand): Promise<void> {
    const { user, requestDto } = command;
    const { account } = user;
    if (account.email !== requestDto.email) {
      throw new ForbiddenException(
        ResponseDTO.fail("Cannot verify email of other user")
      );
    }
    if (account.emailVerified) {
      throw new BadRequestException(
        ResponseDTO.fail("Email has already verified")
      );
    }
    const code = UtilsService.generateUniqueNumberCode(
      EMAIL_VERIFICATION_CODE_LENGTH
    );
    await this._accountRepo.update(account, { verifyEmailCode: code });
    account.verifyEmailCode = code;
    this._mailService.sendEmailAddressVerification(account);
    return;
  }
}
