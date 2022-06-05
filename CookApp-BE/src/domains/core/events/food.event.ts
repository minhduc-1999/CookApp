import { Food } from "../food.domain";

export class FoodCreatedEvent {
  food: Food;
  constructor(newFood: Food) {
    this.food = newFood;
  }
}

export class FoodCensorshipEvent {
  food: Food;
  constructor(food: Food) {
    this.food = food;
  }
}
