import {
  BadRequestException,
  ForbiddenException,
  Inject,
} from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BaseCommand } from "base/cqrs/command.base";
import { ClientSession } from "mongoose";
import { ResendEmailVerificationRequest } from "./resendEmailVerificationRequest";
import { IMailService } from "modules/share/adapters/out/services/mail.service";
import { ResponseDTO } from "base/dtos/response.dto";
import { UserDTO } from "dtos/social/user.dto";

export class ResendEmailVerificationCommand extends BaseCommand {
  requestDto: ResendEmailVerificationRequest;
  constructor(
    requestDto: ResendEmailVerificationRequest,
    user: UserDTO,
    session: ClientSession
  ) {
    super(session, user);
    this.requestDto = requestDto;
  }
}
@CommandHandler(ResendEmailVerificationCommand)
export class ResendEmailVerificationCommandHandler
  implements ICommandHandler<ResendEmailVerificationCommand>
{
  constructor(
    @Inject("IMailService")
    private _mailService: IMailService
  ) {}
  async execute(command: ResendEmailVerificationCommand): Promise<void> {
    const { user, requestDto } = command;
    if (user.email !== requestDto.email) {
      throw new ForbiddenException(
        ResponseDTO.fail("Cannot verify email of other user")
      );
    }
    if (user.emailVerified) {
      throw new BadRequestException(
        ResponseDTO.fail("Email has already verified")
      );
    }
    this._mailService.sendEmailAddressVerification(user.id, requestDto.email);
    return;
  }
}
