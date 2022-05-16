import {
  ConflictException,
  Inject,
  InternalServerErrorException,
} from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { User } from "domains/social/user.domain";
import { BaseCommand } from "base/cqrs/command.base";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { CreateUnitRequest } from "./createUnitRequest";
import { IUnitRepository } from "modules/core/adapters/out/repositories/unit.repository";
import { Unit } from "domains/core/ingredient.domain";
import { ResponseDTO } from "base/dtos/response.dto";
import { UserErrorCode } from "enums/errorCode.enum";

export class CreateUnitCommand extends BaseCommand {
  req: CreateUnitRequest;
  constructor(user: User, req: CreateUnitRequest, tx: ITransaction) {
    super(tx, user);
    this.req = req;
  }
}

@CommandHandler(CreateUnitCommand)
export class CreateUnitCommandHandler
  implements ICommandHandler<CreateUnitCommand>
{
  constructor(
    @Inject("IUnitRepository")
    private _unitRepo: IUnitRepository
  ) {}
  async execute(command: CreateUnitCommand): Promise<void> {
    const { req, tx } = command;

    const newUnit = new Unit({
      name: req.name,
    });

    try {
      await this._unitRepo.setTransaction(tx).insertUnit(newUnit);
    } catch (err) {
      if (err.code === "23505")
        throw new ConflictException(
          ResponseDTO.fail(
            "Unit already existed",
            UserErrorCode.UNIT_ALREADY_EXISTED
          )
        );
      throw new InternalServerErrorException();
    }
    return;
  }
}
