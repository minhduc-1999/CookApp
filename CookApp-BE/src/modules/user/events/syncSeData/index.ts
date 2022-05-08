import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import {
  InterestsChosenEvent,
  UserProfileUpdatedEvent,
} from "domains/social/events/user.event";
import { IUserSeService } from "modules/auth/adapters/out/services/userSe.service";

@EventsHandler(InterestsChosenEvent)
export class InterestsChosenEventHandler
  implements IEventHandler<InterestsChosenEvent>
{
  constructor(
    @Inject("IUserSeService")
    private _userSeService: IUserSeService
  ) {}

  async handle(event: InterestsChosenEvent): Promise<void> {
    const { user } = event;
    console.log(user);
    this._userSeService.updateUserDoc(user);
  }
}

@EventsHandler(UserProfileUpdatedEvent)
export class UserProfileUpdatedEventHandler
  implements IEventHandler<UserProfileUpdatedEvent>
{
  constructor(
    @Inject("IUserSeService")
    private _userSeService: IUserSeService
  ) {}

  async handle(event: UserProfileUpdatedEvent): Promise<void> {
    const { user } = event;
    this._userSeService.updateUserDoc(user);
  }
}
