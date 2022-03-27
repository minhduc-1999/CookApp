import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../base/entities/base.entity';
import { Unit } from '../../domains/core/unit.domain';
import { FoodIngredientEntity } from './foodIngredient.entity';

@Entity({ name: 'units' })
export class UnitEntity extends AbstractEntity {

  @Column({ name: "name" })
  name: string;

  @OneToMany(() => FoodIngredientEntity, foodIng => foodIng.unit)
  foodIngredients: FoodIngredientEntity[]

  constructor(unit: Unit) {
    super(unit)
    this.name = unit?.name
  }

  toDomain(): Unit {
    const data = this
    return new Unit({
      ...data,
    })
  }

  update(data: Partial<Unit>): Partial<UnitEntity> {
    return {
      name: data?.name ?? this.name
    }
  }
}

