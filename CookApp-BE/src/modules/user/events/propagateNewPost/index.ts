import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { NewPostEvent } from "modules/notification/events/NewPostNotification";
import { IFeedRepository } from "modules/user/interfaces/repositories/feed.interface";
import { IWallRepository } from "modules/user/interfaces/repositories/wall.interface";

@EventsHandler(NewPostEvent)
export class NewPostEventHandler implements IEventHandler<NewPostEvent> {
  constructor(
    @Inject("IWallRepository")
    private _wallRepository: IWallRepository,
    @Inject("IFeedRepository")
    private _feedRepository: IFeedRepository,
  ) { }

  async handle(event: NewPostEvent): Promise<void> {
    const followers = await this._wallRepository.getFollowers(event.author.id);
    if (followers.length === 0)
      return
    await this._feedRepository.pushNewPost(event.post, followers)
  }
}
