import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../base/entities/base.entity";
import { UserEntity } from "../social/user.entity";
import { FoodEntity } from "./food.entity";
import { FoodVote } from "../../domains/core/foodVote.domain";

@Entity({ name: "food_votes" })
export class FoodVoteEntity extends AbstractEntity {
  @Column({ name: "star" })
  star: number;

  @Column({ name: "comment", nullable: true})
  comment: string;

  @ManyToOne(() => UserEntity, (user) => user.vote, { nullable: false })
  @JoinColumn({ name: "author_id" })
  author: UserEntity;

  @ManyToOne(() => FoodEntity, (food) => food.votes, { nullable: false })
  @JoinColumn({ name: "food_id" })
  food: FoodEntity;

  constructor(vote: FoodVote) {
    super(vote);
    this.star = vote?.star;
    this.comment = vote?.comment;
    this.food = vote?.food && new FoodEntity(vote.food)
    this.author = vote?.author && new UserEntity(vote.author)
  }

  toDomain(): FoodVote {
    const data = this;
    return new FoodVote({
      ...data,
      author: this.author?.toDomain(),
      star: this.star,
      comment: this.comment,
      food: this.food?.toDomain()
    });
  }

  static getUpdatePayload(foodVote: Partial<FoodVote>) : Partial<FoodVoteEntity>{
    return {
      star: foodVote.star,
      comment: foodVote.comment
    }
  }
}
