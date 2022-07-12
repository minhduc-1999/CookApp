import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../base/entities/base.entity";
import { FoodEntity } from "./food.entity";
import { FoodIngredient } from "../../domains/core/ingredient.domain";

@Entity({ name: "food_ingredients" })
export class FoodIngredientEntity extends AbstractEntity {
  @Column({ name: "quantity", nullable: true, type: "float" })
  quantity: number;

  @Column({ name: "unit", nullable: true })
  unit: string;

  @Column({ name: "ingredient" })
  ingredient: string;

  @Column({ name: "kcal", nullable: true })
  kcal: number;

  @ManyToOne(() => FoodEntity, (food) => food.ingredients, { nullable: false })
  @JoinColumn({ name: "food_id" })
  food: FoodEntity;

  constructor(ingre: FoodIngredient) {
    super(ingre);
    this.quantity = ingre?.quantity;
    this.unit = ingre?.unit;
    this.ingredient = ingre?.name;
    this.kcal = ingre?.kcal
  }

  toDomain(): FoodIngredient {
    return new FoodIngredient({
      name: this.ingredient,
      quantity: this.quantity,
      unit: this.unit,
      kcal: this.kcal
    });
  }

  update(data: Partial<FoodIngredient>): Partial<FoodIngredientEntity> {
    return {
      quantity: data?.quantity ?? this.quantity,
      ingredient: data?.name ?? this.ingredient,
      unit: data?.unit ?? this.unit,
    };
  }
}
