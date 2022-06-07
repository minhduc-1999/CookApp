import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BaseCommand } from "base/cqrs/command.base";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { IAccountRepository } from "modules/auth/interfaces/repositories/account.interface";
import { User } from "domains/social/user.domain";
import { IRoleRepository } from "modules/auth/adapters/out/repositories/role.repository";
import { ChangeRoleRequest } from "./changeRoleRequest";
import { ResponseDTO } from "base/dtos/response.dto";
import { UserErrorCode } from "enums/errorCode.enum";

export class ChangeRoleCommand extends BaseCommand {
  req: ChangeRoleRequest;
  constructor(req: ChangeRoleRequest, tx: ITransaction, user: User) {
    super(tx, user);
    this.req = req;
  }
}
@CommandHandler(ChangeRoleCommand)
export class ChangeRoleCommandHandler
  implements ICommandHandler<ChangeRoleCommand>
{
  constructor(
    @Inject("IAccountRepository")
    private _accountRepo: IAccountRepository,
    @Inject("IRoleRepository")
    private _role: IRoleRepository
  ) {}
  async execute(command: ChangeRoleCommand): Promise<void> {
    const { req } = command;
    const { sign, userId } = req;
    const role = await this._role.getRole(sign);
    if (!role) {
      throw new NotFoundException(
        ResponseDTO.fail("Role not found", UserErrorCode.ROLE_NOT_FOUND)
      );
    }

    const account = await this._accountRepo.getAccountByUserId(userId);

    if (!account)
      throw new NotFoundException(
        "User not found",
        UserErrorCode.USER_NOT_FOUND
      );

    if (account.role.sign === sign) return;

    await this._accountRepo.updateRole(account, role);

    return;
  }
}
