import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { BaseCommand } from "base/cqrs/command.base";
import { ResponseDTO } from "base/dtos/response.dto";
import { User } from "domains/social/user.domain";
import { IUnitRepository } from "modules/core/adapters/out/repositories/unit.repository";

export class DeleteUnitCommand extends BaseCommand {
  unitId: string;
  constructor(user: User, tx: ITransaction, unitId: string) {
    super(tx, user);
    this.unitId = unitId;
  }
}

@CommandHandler(DeleteUnitCommand)
export class DeleteUnitCommandHandler
  implements ICommandHandler<DeleteUnitCommand>
{
  constructor(
    @Inject("IUnitRepository")
    private _unitRepo: IUnitRepository
  ) {}
  async execute(command: DeleteUnitCommand): Promise<any> {
    const { unitId, tx } = command;
    const unit = await this._unitRepo.getById(unitId);
    if (!unit) {
      throw new NotFoundException(
        ResponseDTO.fail("Unit not found")
      );
    }
    await this._unitRepo.setTransaction(tx).deleteUnit(unit);
  }
}
