import { Image, Video } from "../../domains/social/media.domain";
import { MediaType } from "../../enums/social.enum";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "../../base/entities/base.entity";
import { Food } from "../../domains/core/food.domain";
import { FoodIngredientEntity } from "./foodIngredient.entity";
import { RecipeStepEntity } from "./recipeStep.entity";
import { UserEntity } from "../../entities/social/user.entity";
import { PostEntity } from "../../entities/social/post.entity";
import { FoodVoteEntity } from "./foodVote.entity";

@Entity({ name: "foods" })
export class FoodEntity extends AbstractEntity {
  @Column({ name: "servings" })
  servings: number;

  @Column({ name: "total_time" })
  totalTime: number;

  @Column({ name: "url", nullable: true })
  url: string;

  @Column({ name: "description", nullable: true })
  description: string;

  @Column({ name: "name" })
  name: string;

  @Column({ name: "video_url", nullable: true })
  videoUrl: string;

  @OneToMany(() => FoodIngredientEntity, (foodIng) => foodIng.food, {
    cascade: ["insert"],
  })
  ingredients: FoodIngredientEntity[];

  @OneToMany(() => RecipeStepEntity, (step) => step.food)
  steps: RecipeStepEntity[];

  @OneToMany(() => FoodMediaEntity, (media) => media.food, {
    cascade: ["insert"],
  })
  medias: FoodMediaEntity[];

  @ManyToOne(() => UserEntity, (user) => user.foods, { nullable: false })
  @JoinColumn({ name: "author_id" })
  author: UserEntity;

  @OneToMany(() => PostEntity, post => post.foodRef)
  referredPosts: PostEntity[]

  @OneToMany(() => FoodVoteEntity, vote => vote.food)
  votes: FoodVoteEntity[]

  constructor(food: Food) {
    super(food);
    this.name = food?.name;
    this.videoUrl = food?.videoUrl;
    this.author = food?.author && new UserEntity(food.author);
    this.totalTime = food?.totalTime;
    this.servings = food?.servings;
    this.description = food?.description;
    this.url = food?.url;
    this.ingredients =
      food?.ingredients &&
      food.ingredients.map((ing) => new FoodIngredientEntity(ing));
    this.medias =
      food?.photos && food.photos.map((photo) => new FoodMediaEntity(photo));
  }

  toDomain(): Food {
    const data = this;
    return new Food({
      ...data,
      photos: this.medias?.map((media) => media.toDomain()),
      steps: this.steps?.map((step) => step.toDomain()),
      ingredients: this.ingredients?.map((ing) => ing.toDomain()),
      author: this.author?.toDomain(),
    });
  }

  update(data: Partial<Food>): Partial<FoodEntity> {
    return {
      servings: data?.servings ?? this.servings,
      totalTime: data?.totalTime ?? this.totalTime,
      url: data?.url ?? this.url,
      description: data?.description ?? this.description,
      name: data?.name ?? this.name,
      videoUrl: data?.videoUrl ?? this.videoUrl,
    };
  }
}

@Entity({ name: "food_medias" })
export class FoodMediaEntity extends AbstractEntity {
  @ManyToOne(() => FoodEntity, { nullable: false })
  @JoinColumn({ name: "food_id" })
  food: FoodEntity;

  @Column({
    name: "type",
    type: "enum",
    enum: MediaType,
  })
  type: MediaType;

  @Column({ name: "key" })
  key: string;

  constructor(media: Image | Video, food?: Food) {
    super(media);
    this.key = media?.key;
    this.type = media?.type;
    this.food = food && new FoodEntity(food);
  }

  toDomain(): Image | Video {
    switch (this.type) {
      case MediaType.IMAGE:
        return new Image({
          key: this.key,
          id: this.id,
        });
      case MediaType.VIDEO:
        return new Video({
          key: this.key,
          id: this.id,
        });
    }
  }
}
