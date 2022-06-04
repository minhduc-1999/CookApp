import {
  ConflictException,
  Inject,
  InternalServerErrorException,
} from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { RegisterRequest } from "./registerRequest";
import { RegisterResponse } from "./registerResponse";
import { User } from "domains/social/user.domain";
import { IMailService } from "modules/share/adapters/out/services/mail.service";
import { IConfigurationService } from "modules/configuration/adapters/out/services/configuration.service";
import { TypeormException } from "exception_filter/postgresException.filter";
import { ResponseDTO } from "base/dtos/response.dto";
import { UserErrorCode } from "enums/errorCode.enum";
import { Account } from "domains/social/account.domain";
import { BaseCommand } from "base/cqrs/command.base";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { IUserService } from "modules/auth/services/user.service";
import { ConfigService } from "nestjs-config";
import { IRoleRepository } from "modules/auth/adapters/out/repositories/role.repository";
import { UserCreatedEvent } from "domains/social/events/user.event";
import { IAuthentication } from "modules/auth/services/authentication.service";
import { UtilsService } from "providers/utils.service";
import { EMAIL_VERIFICATION_CODE_LENGTH } from "modules/auth/constants";

export class RegisterCommand extends BaseCommand {
  registerDto: RegisterRequest;
  constructor(registerDto: RegisterRequest, tx: ITransaction) {
    super(tx);
    this.registerDto = registerDto;
  }
}
@CommandHandler(RegisterCommand)
export class RegisterCommandHandler
  implements ICommandHandler<RegisterCommand>
{
  constructor(
    @Inject("IUserService") private _userService: IUserService,
    @Inject("IMailService")
    private _mailService: IMailService,
    @Inject("IConfigurationService")
    private _configurationService: IConfigurationService,
    private _configService: ConfigService,
    @Inject("IRoleRepository")
    private _roleRepo: IRoleRepository,
    @Inject("IAuthentication")
    private _authService: IAuthentication,
    private _eventBus: EventBus
  ) {}
  async execute(command: RegisterCommand): Promise<RegisterResponse> {
    const { registerDto, tx } = command;
    const hashedPassword = await this._authService.getHashedPassword(
      registerDto.password
    );
    const userRole = await this._roleRepo.getRole("user");
    const account = new Account({
      ...registerDto,
      password: hashedPassword,
      emailVerified: !this._configService.get("app.emailVerificationRequire"),
      role: userRole,
      verifyEmailCode: UtilsService.generateUniqueNumberCode(EMAIL_VERIFICATION_CODE_LENGTH)
    });

    const newUser = new User({
      account,
    });

    let createdUser: User;

    try {
      createdUser = await this._userService.createNewUser(newUser, tx);
    } catch (err) {
      console.error(err);
      if (err instanceof TypeormException) {
        throw new ConflictException(
          ResponseDTO.fail(
            "Account has been existed",
            UserErrorCode.ACCOUNT_ALREADY_EXISTED
          )
        );
      }
      throw new InternalServerErrorException();
    }
    await this._configurationService.setupConfigForNewUser(createdUser);
    this._mailService.sendEmailAddressVerification(
      createdUser.account
    );
    this._eventBus.publish(new UserCreatedEvent(createdUser));
    return new RegisterResponse(createdUser);
  }
}
