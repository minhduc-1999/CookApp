import { ConflictException, Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { User } from "domains/social/user.domain";
import { BaseCommand } from "base/cqrs/command.base";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { IFoodRepository } from "modules/core/adapters/out/repositories/food.repository";
import { ResponseDTO } from "base/dtos/response.dto";
import { UserErrorCode } from "enums/errorCode.enum";
import { Food } from "domains/core/food.domain";
import { FoodConfirmedEvent, FoodCreatedEvent } from "domains/core/events/food.event";
import { IFoodService } from "modules/core/services/food.service";

export class ConfirmFoodCommand extends BaseCommand {
  foodId: string;
  constructor(tx: ITransaction, user: User, foodId: string) {
    super(tx, user);
    this.foodId = foodId;
  }
}

@CommandHandler(ConfirmFoodCommand)
export class ConfirmFoodCommandHandler
  implements ICommandHandler<ConfirmFoodCommand>
{
  constructor(
    @Inject("IFoodRepository")
    private _foodRepo: IFoodRepository,
    private _eventBus: EventBus,
    @Inject("IFoodService")
    private _foodService: IFoodService
  ) {}
  async execute(command: ConfirmFoodCommand): Promise<void> {
    const { tx, foodId } = command;

    const food = await this._foodService.getById(foodId);

    if (food.confirmed) {
      throw new ConflictException(
        ResponseDTO.fail(
          "Food already confirmed",
          UserErrorCode.FOOD_ALREADY_CONFIRMED
        )
      );
    }

    const updateData: Partial<Food> = {
      confirmed: true,
    };

    await this._foodRepo.setTransaction(tx).updateFood(food, updateData);
    this._eventBus.publish(new FoodConfirmedEvent(food));
    this._eventBus.publish(new FoodCreatedEvent(food));
    return;
  }
}
