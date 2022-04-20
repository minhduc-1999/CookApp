import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../base/entities/base.entity';
import { Food } from '../../domains/core/food.domain';
import { FoodEntity } from './food.entity';
import { Ingredient } from '../../domains/core/ingredient.domain';
import { Audit } from '../../domains/audit.domain';

@Entity({ name: 'food_ingredients' })
export class FoodIngredientEntity extends AbstractEntity {

  @Column({ name: "quantity", nullable: true, type: "float"})
  quantity: number

  @Column({ name: "unit", nullable: true })
  unit: string

  @Column({ name: "ingredient" })
  ingredient: string

  @ManyToOne(() => FoodEntity, food => food.ingredients, { nullable: false })
  @JoinColumn({ name: "food_id" })
  food: FoodEntity

  constructor(food: Food, ingre: Ingredient, audit?: Audit) {
    super(audit)
    this.quantity = ingre?.quantity
    this.unit = ingre?.unit
    this.food = food && new FoodEntity(food)
    this.ingredient = ingre?.name
  }

  toDomain(): Ingredient {
    return new Ingredient({
      name: this.ingredient,
      quantity: this.quantity,
      unit: this.unit
    })
  }

  update(data: Partial<Ingredient>): Partial<FoodIngredientEntity> {
    return {
      quantity: data?.quantity ?? this.quantity,
      ingredient: data?.name ?? this.ingredient,
      unit: data?.unit?? this.unit
    }
  }

}

