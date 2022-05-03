import { RecipeStep } from "../../domains/core/recipeStep.domain";
import { Image, Video } from "../../domains/social/media.domain";
import { MediaType } from "../../enums/social.enum";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { AbstractEntity } from "../../base/entities/base.entity";
import { FoodEntity } from "./food.entity";
import { Food } from "../../domains/core/food.domain";
import { InteractionEntity } from "../../entities/social/interaction.entity";
import { Audit } from "../../domains/audit.domain";

@Entity({ name: "recipe_steps" })
export class RecipeStepEntity {
  @Column({ name: "content" })
  content: string;

  @ManyToOne(() => FoodEntity, (food) => food.steps, { nullable: false })
  @JoinColumn({ name: "food_id" })
  food: FoodEntity;

  @OneToOne(() => InteractionEntity, { primary: true })
  @JoinColumn({ name: "id", referencedColumnName: "id" })
  interaction: InteractionEntity;

  @OneToMany(() => RecipeStepMediaEntity, (media) => media.recipeStep, {
    cascade: ["insert"],
  })
  medias: RecipeStepMediaEntity[];

  constructor(step: RecipeStep, food?: Food) {
    // this.interaction = new InteractionEntity(interaction)
    this.content = step?.content;
    this.food = food && new FoodEntity(food);
    this.medias = step?.photos && step.photos.map(photo => new RecipeStepMediaEntity(photo))
  }

  toDomain(): RecipeStep {
    const audit = new Audit(this.interaction);
    const { nReactions, nComments } = this.interaction;
    return new RecipeStep({
      ...audit,
      nReactions,
      nComments,
      content: this.content,
      photos: this.medias?.map((media) => media.toDomain()),
    });
  }

  update(data: Partial<RecipeStep>): Partial<RecipeStepEntity> {
    return {
      content: data?.content ?? this.content,
    };
  }
}

@Entity({ name: "recipe_step_medias" })
export class RecipeStepMediaEntity extends AbstractEntity {
  @ManyToOne(() => RecipeStepEntity, { nullable: false })
  @JoinColumn({ name: "recipe_step_id" })
  recipeStep: RecipeStepEntity;

  @Column({
    name: "type",
    type: "enum",
    enum: MediaType,
  })
  type: MediaType;

  @Column({ name: "key" })
  key: string;

  constructor(media: Image | Video, recipeStep?: RecipeStep) {
    super(media);
    this.key = media?.key;
    this.type = media?.type;
    this.recipeStep = recipeStep && new RecipeStepEntity(recipeStep);
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
