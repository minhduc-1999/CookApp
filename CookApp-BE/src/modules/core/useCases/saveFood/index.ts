import { ConflictException, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { User } from "domains/social/user.domain";
import { BaseCommand } from "base/cqrs/command.base";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { IFoodRepository } from "modules/core/adapters/out/repositories/food.repository";
import { IFoodService } from "modules/core/services/food.service";
import { FoodSave } from "domains/core/foodSave.domain";
import { SaveFoodRequest } from "./saveFoodRequest";
import { ResponseDTO } from "base/dtos/response.dto";
import { UserErrorCode } from "enums/errorCode.enum";

export class SaveFoodFoodCommand extends BaseCommand {
  req: SaveFoodRequest;
  constructor(tx: ITransaction, user: User, req: SaveFoodRequest) {
    super(tx, user);
    this.req = req;
  }
}

@CommandHandler(SaveFoodFoodCommand)
export class SaveFoodCommandHandler
  implements ICommandHandler<SaveFoodFoodCommand>
{
  constructor(
    @Inject("IFoodRepository")
    private _foodRepo: IFoodRepository,
    @Inject("IFoodService")
    private _foodService: IFoodService
  ) {}
  async execute(command: SaveFoodFoodCommand): Promise<void> {
    const { tx, req, user } = command;

    const food = await this._foodService.getById(req.foodId);

    const existedFoodSave = await this._foodRepo.getFoodSave(
      user.id,
      req.foodId
    );

    if (existedFoodSave) {
      if (req.type !== existedFoodSave.type && req.forceUpdate) {
        await this._foodRepo.setTransaction(tx).deleteFoodSave(existedFoodSave);
      } else {
        throw new ConflictException(
          ResponseDTO.fail(
            "Food already saved",
            UserErrorCode.FOOD_ALREADY_SAVED
          )
        );
      }
    }

    const foodSave = new FoodSave({
      type: req.type,
      food,
      user,
    });

    await this._foodRepo.setTransaction(tx).saveFood(foodSave);

    return;
  }
}
