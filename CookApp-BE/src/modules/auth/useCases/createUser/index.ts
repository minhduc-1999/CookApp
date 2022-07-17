import {
  ConflictException,
  Inject,
  InternalServerErrorException,
} from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BaseCommand } from "base/cqrs/command.base";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { User } from "domains/social/user.domain";
import { IRoleRepository } from "modules/auth/adapters/out/repositories/role.repository";
import { ResponseDTO } from "base/dtos/response.dto";
import { UserErrorCode } from "enums/errorCode.enum";
import { CreateUserRequest } from "./createUserRequest";
import { IAuthentication } from "modules/auth/services/authentication.service";
import { TypeormException } from "exception_filter/postgresException.filter";
import { RegisterResponse } from "../register/registerResponse";
import { IUserService } from "modules/auth/services/user.service";
import { IConfigurationService } from "modules/configuration/adapters/out/services/configuration.service";
import { Account } from "domains/social/account.domain";

export class CreateUserCommand extends BaseCommand {
  req: CreateUserRequest;
  constructor(req: CreateUserRequest, tx: ITransaction, user: User) {
    super(tx, user);
    this.req = req;
  }
}
@CommandHandler(CreateUserCommand)
export class CreateUserUseCase
  implements ICommandHandler<CreateUserCommand>
{
  constructor(
    @Inject("IAuthentication")
    private _authService: IAuthentication,
    @Inject("IRoleRepository")
    private _roleRepo: IRoleRepository,
    @Inject("IUserService") private _userService: IUserService,
    @Inject("IConfigurationService")
    private _configurationService: IConfigurationService
  ) {}
  async execute(command: CreateUserCommand): Promise<RegisterResponse> {
    const { req, tx } = command;
    const { username, rawPassword, email, phone, role } = req;
    const hashedPassword = await this._authService.getHashedPassword(
      rawPassword
    );

    const userRole = await this._roleRepo.getRole(role);
    const account = new Account({
      username,
      password: hashedPassword,
      email,
      phone,
      emailVerified: true,
      role: userRole,
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
    if (role === "user" || role === "nutritionist") {
      await this._configurationService.setupConfigForNewUser(createdUser);
    }
    return new RegisterResponse(createdUser);
  }
}
