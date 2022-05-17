import { Food } from "../food.domain";

export class FoodCreatedEvent {
  food: Food
  constructor(newFood: Food) {
    this.food = newFood
  }
}
