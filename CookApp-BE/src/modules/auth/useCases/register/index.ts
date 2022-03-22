import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BaseCommand } from "base/cqrs/command.base";
import { RegisterRequest } from "./registerRequest";
import { RegisterResponse } from "./registerResponse";
import * as bcrypt from "bcrypt";
import { User } from "domains/social/user.domain";
import { generateDisplayName } from "utils";
import { IMailService } from "modules/share/adapters/out/services/mail.service";
import { Transaction } from "neo4j-driver";
import { IUserRepository } from "modules/auth/interfaces/repositories/user.interface";
import { IConfigurationService } from "modules/configuration/adapters/out/services/configuration.service";

export class RegisterCommand extends BaseCommand {
  registerDto: RegisterRequest;
  constructor(registerDto: RegisterRequest, tx: Transaction) {
    super(tx);
    this.registerDto = registerDto;
  }
}
@CommandHandler(RegisterCommand)
export class RegisterCommandHandler
  implements ICommandHandler<RegisterCommand>
{
  constructor(
    @Inject("IUserRepository") private _userRepo: IUserRepository,
    @Inject("IMailService")
    private _mailService: IMailService,
    @Inject("IConfigurationService")
    private _configurationService: IConfigurationService
  ) {}
  async execute(command: RegisterCommand): Promise<RegisterResponse> {
    const { registerDto, tx} = command;
    const hashedPassword = bcrypt.hashSync(registerDto.password, 10);
    const newUser = new User({
      ...registerDto,
      password: hashedPassword,
      displayName: generateDisplayName(),
      emailVerified: true
    });
    const createdUser = await this._userRepo
      .setTransaction(tx)
      .createUser(newUser);
    await this._configurationService.setupConfigForNewUser(createdUser)
    this._mailService.sendEmailAddressVerification(
      createdUser.id,
      createdUser.email
    );
    return createdUser;
  }
}
