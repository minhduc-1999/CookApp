import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../base/entities/base.entity';
import { Food } from '../../domains/core/food.domain';
import { UnitEntity } from './unit.entity';
import { FoodEntity } from './food.entity';
import { IngredientEntity } from './ingredient.entity';
import { Ingredient } from '../../domains/core/ingredient.domain';
import { Unit } from '../../domains/core/unit.domain';
import { Image } from '../../domains/social/media.domain';
import { Audit } from '../../domains/audit.domain';

@Entity({ name: 'core.food_ingredients' })
export class FoodIngredientEntity extends AbstractEntity {

  @Column({ name: "quantity" })
  quantity: number

  @ManyToOne(() => UnitEntity, unit => unit.foodIngredients)
  @JoinColumn({ name: "unit_id" })
  unit: UnitEntity

  @ManyToOne(() => FoodEntity, food => food.ingredients)
  @JoinColumn({ name: "food_id" })
  food: FoodEntity

  @ManyToOne(() => IngredientEntity, ing => ing.foods)
  @JoinColumn({ name: "ingredient_id" })
  ingredient: IngredientEntity

  constructor(food: Food, ingre: Ingredient, unit: Unit, quantity: number, audit?: Audit) {
    super(audit)
    this.quantity = quantity
    this.unit = new UnitEntity(unit)
    this.food = new FoodEntity(food)
    this.ingredient = new IngredientEntity(ingre)
  }

  toDomain(): Ingredient {
    return new Ingredient({
      name: this.ingredient?.name,
      cover: this.ingredient?.cover && new Image({ key: this.ingredient.cover }),
      quantity: this.quantity,
      unit: this.unit?.toDomain()
    })
  }

  update(data: Partial<Ingredient>): Partial<FoodIngredientEntity> {
    return {
      quantity: data?.quantity ?? this.quantity,
    }
  }

}

