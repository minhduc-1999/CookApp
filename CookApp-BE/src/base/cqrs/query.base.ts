import { IQuery } from "@nestjs/cqrs";
import { UserDTO } from "dtos/social/user.dto";

export class BaseQuery implements IQuery {
  user: UserDTO;
  constructor(author: UserDTO) {
    this.user = author;
  }
}
