import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, Logger } from "@nestjs/common";
import { Account } from "domains/social/account.domain";
import { ConfigService } from "nestjs-config";

export interface IMailService {
  sendEmailAddressVerification(account: Account): Promise<any>;
  sendEmailResetPassword(account: Account): Promise<void>;
}

@Injectable()
export class MailService implements IMailService {
  logger: Logger = new Logger(MailService.name);
  private _logoUrl: string;
  constructor(
    private _mailerService: MailerService,
    private _configService: ConfigService
  ) {
    this._logoUrl = this._configService.get("system.logoUrl");
  }

  async sendEmailResetPassword(account: Account): Promise<void> {
    const callback = `${this._configService.get(
      "system.resetPasswordPageUrl"
    )}?token=${account.resetPasswordToken}`;
    this._mailerService
      .sendMail({
        to: [account.email],
        subject: `Reset password for Tastify account`,
        template: "reset_password",
        context: {
          callback,
          logoUrl: this._logoUrl,
        },
      })
      .then((value) => {
        this.logger.log(
          `Send reset password email [${value.messageId}] to account ${account.id}'}`
        );
      })
      .catch((err) => this.logger.error(err));
  }

  async sendEmailAddressVerification(account: Account): Promise<any> {
    const { email, verifyEmailCode, id } = account;

    this._mailerService
      .sendMail({
        to: [email],
        subject: `Verify your email for Tastify account`,
        template: "email_verification",
        context: {
          code: verifyEmailCode,
          logoUrl: this._logoUrl,
        },
      })
      .then((value) =>
        this.logger.log(
          `Send email address verification [${value.messageId}] to account ${id}'}`
        )
      )
      .catch((err) => this.logger.error(err));
  }
}
