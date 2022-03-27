import { Ingredient } from '../../domains/core/ingredient.domain';
import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../base/entities/base.entity';
import { FoodIngredientEntity } from './foodIngredient.entity';
import { Image } from '../../domains/social/media.domain';

@Entity({ name: 'core.ingredients' })
export class IngredientEntity extends AbstractEntity {

  @Column({ name: "name" })
  name: string;

  @OneToMany(() => FoodIngredientEntity, foodIng => foodIng.ingredient)
  foods: FoodIngredientEntity[]

  @Column({ name: "cover_img" })
  cover: string

  constructor(ing: Ingredient) {
    super(ing)
  }

  toDomain(): Ingredient {
    const data = this
    return new Ingredient({
      ...data,
      cover: new Image({key: this.cover})
    })
  }

  update(data: Partial<Ingredient>): Partial<IngredientEntity> {
    return {
      name: data?.name ?? this.name,
      cover: data?.cover?.key ?? this.cover
    }
  }
}
