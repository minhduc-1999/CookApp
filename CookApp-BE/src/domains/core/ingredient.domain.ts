import { Audit } from "../../domains/audit.domain";

export class FoodIngredient extends Audit {
  name: string;

  quantity: number;

  unit: string;

  kcal: number;

  constructor(obj: Partial<FoodIngredient>) {
    super(obj);
    this.name = obj?.name;
    this.quantity = obj?.quantity;
    this.unit = obj?.unit;
    this.kcal = obj?.kcal;
  }
}

export class Ingredient extends Audit {
  name: string;

  kcal: number;

  constructor(ing: Partial<Ingredient>) {
    super(ing);
    this.name = ing?.name;
    this.kcal = ing?.kcal;
  }
}

export class Unit extends Audit {
  name: string;

  constructor(unit: Partial<Unit>) {
    super(unit);
    this.name = unit?.name;
  }
}
