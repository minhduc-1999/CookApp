import { Ingredient, Unit } from "../../domains/core/ingredient.domain";
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../base/entities/base.entity";

@Entity({ name: "ingredients" })
export class IngredientEntity extends AbstractEntity {
  @Column({ name: "name", unique: true, nullable: false })
  name: string;

  @Column({ name: "kcal", nullable: true, type: "float" })
  kcal: number;

  toDomain(): Ingredient {
    return new Ingredient(this);
  }

  constructor(ing: Ingredient) {
    super(ing);
    this.name = ing?.name;
    this.kcal = ing?.kcal;
  }
}

@Entity({ name: "units" })
export class UnitEntity extends AbstractEntity {
  @Column({ name: "name", nullable: false, unique: true })
  name: string;

  @Column({ name: "to_gram", nullable: true, type: "float" })
  toGram: number;

  toDomain(): Unit {
    return new Unit(this);
  }

  constructor(unit: Unit) {
    super(unit);
    this.name = unit?.name;
    this.toGram = unit?.toGram;
  }
}
