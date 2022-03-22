import { IQuery } from "@nestjs/cqrs";
import { User } from "domains/social/user.domain";

export class BaseQuery implements IQuery {
  user: User;
  constructor(author: User) {
    this.user = author;
  }
}
