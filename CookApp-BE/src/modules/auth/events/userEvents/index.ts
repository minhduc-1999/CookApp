import { Inject, Logger } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { UserCreatedEvent } from "domains/social/events/user.event";
import { IUserSeService } from "modules/auth/adapters/out/services/userSe.service";

@EventsHandler(UserCreatedEvent)
export class UserCreatedEventHandler
  implements IEventHandler<UserCreatedEvent>
{
  private _logger = new Logger(UserCreatedEventHandler.name)
  constructor(
    @Inject("IUserSeService")
    private _userSeService: IUserSeService,
  ) { }

  async handle(event: UserCreatedEvent): Promise<void> {
    const { user } = event
    this._logger.log(`Update user info to SE for user [${user.id}]`)
    this._userSeService.insertNewUserDoc(user)
  }
}
