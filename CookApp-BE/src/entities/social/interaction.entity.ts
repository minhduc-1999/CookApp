import { AbstractEntity } from "../../base/entities/base.entity";
import { Column, Entity, OneToOne } from "typeorm";
import { IInteractable } from "../../domains/interfaces/IInteractable.interface";
import { PostEntity } from "./post.entity";
import { RecipeStepEntity } from "entities/core/recipeStep.entity";

@Entity({ name: "interactions" })
export class InteractionEntity extends AbstractEntity {
  @Column({
    name: "n_comments",
    default: 0,
  })
  nComments: number;

  @Column({
    name: "n_reactions",
    default: 0,
  })
  nReactions: number;

  @OneToOne(() => PostEntity, (post) => post.interaction)
  post?: PostEntity;

  @OneToOne(() => RecipeStepEntity, (recipe) => recipe.interaction, {
    cascade: ["insert"],
  })
  recipeStep?: RecipeStepEntity;

  constructor(data: IInteractable) {
    super(data);
    this.nReactions = data?.nReactions;
    this.nComments = data?.nComments;
  }
}
