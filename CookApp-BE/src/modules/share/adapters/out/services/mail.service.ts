import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "nestjs-config";

export interface IMailService {
  sendEmailAddressVerification(userID: string, address: string): Promise<any>;
}

@Injectable()
export class MailService implements IMailService {
  logger: Logger = new Logger(MailService.name);
  constructor(
    private _mailerService: MailerService,
    private _jwtService: JwtService,
    private _configService: ConfigService
  ) {}
  async sendEmailAddressVerification(
    userID: string,
    address: string
  ): Promise<any> {
    const callback = this._configService.get("mail.emailVerificationCallback");

    const token = this._jwtService.sign({ sub: userID, email: address });
    this._mailerService
      .sendMail({
        to: [address],
        subject: `Verify your email for Tastify`,
        template: "email_verification",
        context: {
          callback,
          token,
        },
      })
      .then((value) =>
        this.logger.log(
          `Send email address verification [${value.messageId}] to user ${userID}'}`
        )
      )
      .catch((err) => this.logger.error(err));
  }
}
