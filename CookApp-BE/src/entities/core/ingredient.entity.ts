import { Ingredient, Unit } from "../../domains/core/ingredient.domain";
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../base/entities/base.entity";

@Entity({ name: "ingredients" })
export class IngredientEntity extends AbstractEntity {
  @Column({ name: "name", unique: true, nullable: false })
  name: string;

  toDomain(): Ingredient {
    return new Ingredient(this)
  }
}

@Entity({ name: "units" })
export class UnitEntity extends AbstractEntity {
  @Column({ name: "name", nullable: false, unique: true })
  name: string;

  toDomain(): Unit {
    return new Unit(this)
  }
}
