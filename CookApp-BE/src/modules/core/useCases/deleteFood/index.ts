import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { BaseCommand } from "base/cqrs/command.base";
import { ResponseDTO } from "base/dtos/response.dto";
import { User } from "domains/social/user.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { IFoodRepository } from "modules/core/adapters/out/repositories/food.repository";

export class DeleteFoodCommand extends BaseCommand {
  foodId: string;
  constructor(user: User, tx: ITransaction, foodId: string) {
    super(tx, user);
    this.foodId = foodId;
  }
}

@CommandHandler(DeleteFoodCommand)
export class DeleteFoodCommandHandler
  implements ICommandHandler<DeleteFoodCommand>
{
  constructor(
    @Inject("IFoodRepository")
    private _foodRepo: IFoodRepository
  ) {}
  async execute(command: DeleteFoodCommand): Promise<any> {
    const { foodId, tx } = command;
    const food = await this._foodRepo.getById(foodId);
    if (!food) {
      throw new NotFoundException(
        ResponseDTO.fail("Food not found", UserErrorCode.FOOD_NOT_FOUND)
      );
    }
    await this._foodRepo.setTransaction(tx).deleteFood(food);
  }
}
