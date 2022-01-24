import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BaseCommand } from "base/cqrs/command.base";
import { IUserRepository } from "modules/auth/adapters/out/repositories/user.repository";
import { RegisterRequest } from "./registerRequest";
import { RegisterResponse } from "./registerResponse";
import * as bcrypt from "bcrypt";
import { UserDTO } from "dtos/social/user.dto";
import { generateDisplayName } from "utils";
import { IMailService } from "modules/share/adapters/out/services/mail.service";
import { Transaction } from "neo4j-driver";

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
    private _mailService: IMailService
  ) {}
  async execute(command: RegisterCommand): Promise<RegisterResponse> {
    const { registerDto, tx} = command;
    const hashedPassword = bcrypt.hashSync(registerDto.password, 10);
    const newUserDto = new UserDTO({
      ...registerDto,
      password: hashedPassword,
      displayName: generateDisplayName(),
      emailVerified: false
    });
    const createdUser = await this._userRepo
      .setTransaction(tx)
      .createUser(newUserDto);
    this._mailService.sendEmailAddressVerification(
      createdUser.id,
      createdUser.email
    );
    return createdUser;
  }
}
