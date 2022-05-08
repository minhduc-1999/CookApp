import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { UserCreatedEvent } from "domains/social/events/user.event";
import { IUserSeService } from "modules/auth/adapters/out/services/userSe.service";

@EventsHandler(UserCreatedEvent)
export class SyncUserDataEventHandler
  implements IEventHandler<UserCreatedEvent>
{
  constructor(
    @Inject("IUserSeService")
    private _userSeService: IUserSeService,
  ) { }

  async handle(event: UserCreatedEvent): Promise<void> {
    const { user } = event

    this._userSeService.insertNewUserDoc(user)

  }
}
