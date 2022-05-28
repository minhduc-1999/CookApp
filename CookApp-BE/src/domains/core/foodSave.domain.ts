import { Audit } from "../../domains/audit.domain";
import { User } from "../../domains/social/user.domain";
import { FoodSaveType } from "../../enums/core.enum";
import { Food } from "./food.domain";

export class FoodSave extends Audit {
  food: Food;
  user: User;
  type: FoodSaveType;

  constructor(init: Partial<FoodSave>) {
    super(init);
    this.food = init?.food;
    this.user = init?.user;
    this.type = init?.type;
  }
}
