import { ConflictException, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { User } from "domains/social/user.domain";
import { BaseCommand } from "base/cqrs/command.base";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { IFoodRepository } from "modules/core/adapters/out/repositories/food.repository";
import { ResponseDTO } from "base/dtos/response.dto";
import { UserErrorCode } from "enums/errorCode.enum";

export class DeleteFoodSaveCommand extends BaseCommand {
  foodId: string;
  constructor(tx: ITransaction, user: User, foodId: string) {
    super(tx, user);
    this.foodId = foodId
  }
}

@CommandHandler(DeleteFoodSaveCommand)
export class DeleteFoodSaveCommandHandler
  implements ICommandHandler<DeleteFoodSaveCommand>
{
  constructor(
    @Inject("IFoodRepository")
    private _foodRepo: IFoodRepository
  ) {}
  async execute(command: DeleteFoodSaveCommand): Promise<void> {
    const { tx, foodId, user } = command;

    const existedFoodSave = await this._foodRepo.getFoodSave(user.id, foodId);

    if (!existedFoodSave) {
      throw new ConflictException(
        ResponseDTO.fail("You have not saved this food yet", UserErrorCode.FOOD_NOT_SAVE)
      );
    }

    await this._foodRepo.setTransaction(tx).deleteFoodSave(existedFoodSave);

    return;
  }
}
