import { User } from "../user.domain";

export class UserCreatedEvent {
  user: User;
  constructor(newUser: User) {
    this.user = newUser;
  }
}

export class UserProfileUpdatedEvent {
  user: User;
  constructor(user: User) {
    this.user = user;
  }
}
