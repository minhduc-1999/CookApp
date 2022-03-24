import {
  BadRequestException,
  Inject,
  UnauthorizedException,
} from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BaseCommand } from "base/cqrs/command.base";
import { VerifyEmailRequest } from "./verifyEmailRequest";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "nestjs-config";
import { ResponseDTO } from "base/dtos/response.dto";
import { UserErrorCode } from "enums/errorCode.enum";
import { IUserRepository } from "modules/auth/interfaces/repositories/user.interface";
import { ITransaction } from "adapters/typeormTransaction.adapter";

export class VerifyEmailCommand extends BaseCommand {
  requestDto: VerifyEmailRequest;
  constructor(requestDto: VerifyEmailRequest, tx: ITransaction) {
    super(tx);
    this.requestDto = requestDto;
  }
}
@CommandHandler(VerifyEmailCommand)
export class VerifyEmailCommandHandler
  implements ICommandHandler<VerifyEmailCommand>
{
  constructor(
    @Inject("IUserRepository") private _userRepo: IUserRepository,
    private _jwtService: JwtService,
    private _configService: ConfigService
  ) { }
  async execute(command: VerifyEmailCommand): Promise<void> {
    const email = this.decodeVerificationToken(command.requestDto.token);
    const user = await this._userRepo.getUserByEmail(email);
    if (user.account.emailVerified) {
      throw new BadRequestException(
        ResponseDTO.fail("Email has already been verified")
      );
    }
    // TODO: update account
    // await this._userRepo.setTransaction(command.tx).updateUserProfile({
    //   emailVerified: true,
    // });
    return;
  }

  decodeVerificationToken(token: string) {
    const emailVerificationSecret = this._configService.get(
      "mail.emailVerificationSecret"
    );
    try {
      const payload = this._jwtService.verify(token, {
        secret: emailVerificationSecret,
      });

      if (typeof payload === "object" && "email" in payload) {
        return payload.email;
      }
    } catch (err) {
      throw new UnauthorizedException(
        ResponseDTO.fail("Your email verification request has been expired")
      );
    }

    throw new UnauthorizedException(
      ResponseDTO.fail("Invalid ID", UserErrorCode.INVALID_TOKEN)
    );
  }
}
