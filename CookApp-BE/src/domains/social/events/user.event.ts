import { Topic, User } from "../user.domain";

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

export class InterestsChosenEvent {
  user: User;
  constructor(user: User, topics: Topic[]) {
    this.user = user;
    this.user.interestedTopics = topics
  }
}
