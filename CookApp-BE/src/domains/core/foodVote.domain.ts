import { User } from "../social/user.domain";
import { Audit } from "../audit.domain";
import { Food } from "./food.domain";

export class FoodVote extends Audit {
  star: number;

  comment: string;

  author: User

  food: Food

  constructor(vote: Partial<FoodVote>) {
    super(vote)
    this.author = vote?.author
    this.star = vote?.star
    this.comment = vote?.comment
    this.food = vote?.food
  }
}
