import { User } from "../user.domain";

export class UserCreatedEvent {
  user: User;
  constructor(newUser: User) {
    this.user = newUser;
  }
}
