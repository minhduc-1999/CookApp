import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { FoodCreatedEvent } from "domains/core/events/food.event";
import { IFoodSeService } from "modules/core/adapters/out/services/foodSe.service";

@EventsHandler(FoodCreatedEvent)
export class SyncFoodCreatedEventHandler
  implements IEventHandler<FoodCreatedEvent>
{
  constructor(
    @Inject("IFoodSeService")
    private _foodSeService: IFoodSeService
  ) {}

  async handle(event: FoodCreatedEvent): Promise<void> {
    const { food } = event;
    this._foodSeService.insertNewFoodDoc(food);
  }
}
