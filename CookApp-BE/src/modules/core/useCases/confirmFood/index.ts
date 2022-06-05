import { ConflictException, Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { User } from "domains/social/user.domain";
import { BaseCommand } from "base/cqrs/command.base";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { IFoodRepository } from "modules/core/adapters/out/repositories/food.repository";
import { ResponseDTO } from "base/dtos/response.dto";
import { UserErrorCode } from "enums/errorCode.enum";
import { Food } from "domains/core/food.domain";
import {
  FoodCensorshipEvent,
  FoodCreatedEvent,
} from "domains/core/events/food.event";
import { IFoodService } from "modules/core/services/food.service";
import { ConfirmFoodRequest } from "./confirmFoodRequest";
import { FoodStatusType } from "enums/core.enum";

export class ConfirmFoodCommand extends BaseCommand {
  req: ConfirmFoodRequest;
  constructor(tx: ITransaction, user: User, req: ConfirmFoodRequest) {
    super(tx, user);
    this.req = req;
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
    const { tx, req } = command;

    const food = await this._foodService.getById(req.foodId);

    if (food.status === FoodStatusType.CONFIRMED) {
      throw new ConflictException(
        ResponseDTO.fail(
          "Food already confirmed",
          UserErrorCode.FOOD_ALREADY_CONFIRMED
        )
      );
    }

    if (food.status !== FoodStatusType.UNCENSORED)
      throw new NotFoundException(
        ResponseDTO.fail("Not found", UserErrorCode.FOOD_NOT_FOUND)
      );

    const updateData: Partial<Food> = {
      status: req.type,
    };

    await this._foodRepo.setTransaction(tx).updateFood(food, updateData);
    food.status = req.type;
    this._eventBus.publish(new FoodCensorshipEvent(food));
    if (food.status === FoodStatusType.CONFIRMED)
      this._eventBus.publish(new FoodCreatedEvent(food));
    return;
  }
}
