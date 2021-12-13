import { AuditDTO } from "base/dtos/audit.dto";
import { Expose, Type } from "class-transformer";

export class FoodDTO extends AuditDTO {
  @Expose()
  servings: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  photos: string[];

  @Expose()
  totalTime: number;

  @Expose()
  cookingMethod: string[];

  @Expose()
  group: string;

  @Expose()
  @Type(() => Step)
  steps: Step[];

  @Expose()
  @Type(() => Ingredient)
  ingredients: Ingredient;

  @Expose()
  origin: string
}

class Unit {
  @Expose()
  unit: string;
  @Expose()
  value: number;
}

class Ingredient {
  @Expose()
  @Type(() => Unit)
  unit: Unit;
  @Expose()
  name: string;
  @Expose()
  quantity: number;
}

class Step {
  @Expose()
  content: string;
  @Expose()
  photo: string[];
}

