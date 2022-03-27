import { Image, Video } from '../../domains/social/media.domain';
import { MediaType } from '../../enums/social.enum';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../base/entities/base.entity';
import { Food } from '../../domains/core/food.domain';
import { FoodIngredientEntity } from './foodIngredient.entity';
import { RecipeStepEntity } from './recipeStep.entity';

@Entity({ name: 'foods' })
export class FoodEntity extends AbstractEntity {

  @Column({ name: 'servings' })
  servings: number;

  @Column({ name: 'total_time' })
  totalTime: number;

  @Column({ name: 'url' })
  url: string

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: "name" })
  name: string;

  @Column({ name: "video_url" })
  videoUrl: string;

  @OneToMany(() => FoodIngredientEntity, foodIng => foodIng.food)
  ingredients: FoodIngredientEntity[]

  @OneToMany(() => RecipeStepEntity, step => step.food)
  steps: RecipeStepEntity[]

  @OneToMany(() => FoodMediaEntity, media => media.food)
  medias: FoodMediaEntity[]

  constructor(food: Food) {
    super(food)
  }

  toDomain(): Food {
    const data = this
    return new Food({
      ...data,
      photos: this.medias?.map(media => media.toDomain()),
      steps: this.steps?.map(step => step.toDomain()),
      ingredients: this.ingredients?.map(ing => ing.toDomain())
    })
  }

  update(data: Partial<Food>): Partial<FoodEntity> {
    return {
      servings: data?.servings ?? this.servings,
      totalTime: data?.totalTime ?? this.totalTime,
      url: data?.url ?? this.url,
      description: data?.description ?? this.description,
      name: data?.name ?? this.name,
      videoUrl: data?.videoUrl ?? this.videoUrl
    }
  }

}

@Entity({ name: 'food_medias' })
export class FoodMediaEntity extends AbstractEntity {

  @ManyToOne(() => FoodEntity)
  @JoinColumn({ name: "food_id" })
  food: FoodEntity;

  @Column({
    name: 'type',
    type: "enum",
    enum: MediaType
  })
  type: MediaType;

  @Column({ name: 'key' })
  key: string

  constructor(media: Image | Video, food?: Food) {
    super(media)
    this.key = media?.key
    this.type = media?.type
    this.food = food && new FoodEntity(food)
  }

  toDomain(): Image | Video {
    switch (this.type) {
      case MediaType.IMAGE:
        return new Image({
          key: this.key,
          id: this.id
        })
      case MediaType.VIDEO:
        return new Video({
          key: this.key,
          id: this.id
        })
    }
  }
}
