import { Audit } from "../../domains/audit.domain";

export class FoodIngredient extends Audit {
  name: string;

  quantity: number

  unit: string

  constructor(obj: Partial<FoodIngredient>) {
    super(obj)
    this.name = obj?.name
    this.quantity = obj?.quantity
    this.unit = obj?.unit
  }
}

export class Ingredient extends Audit {
  name: string

  constructor(ing: Partial<Ingredient>) {
    super(ing)
    this.name = ing?.name
  }
}

export class Unit extends Audit {
  name: string

  constructor(unit: Partial<Unit>) {
    super(unit)
    this.name = unit?.name
  }
}
