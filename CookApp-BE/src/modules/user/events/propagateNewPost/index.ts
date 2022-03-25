import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { NewPostEvent } from "modules/notification/events/NewPostNotification";
import { IFeedRepository } from "modules/user/interfaces/repositories/feed.interface";
import { IFollowRepository } from "modules/user/interfaces/repositories/follow.interface";

@EventsHandler(NewPostEvent)
export class NewPostEventHandler implements IEventHandler<NewPostEvent> {
  constructor(
    @Inject("IFeedRepository")
    private _feedRepository: IFeedRepository,
    @Inject("IFollowRepository")
    private _followRepo: IFollowRepository,
  ) { }

  async handle(event: NewPostEvent): Promise<void> {
    const [followers, _] = await this._followRepo.getFollowers(event.author.id);
    if (followers.length === 0)
      return
    await this._feedRepository.pushNewPost(event.post, followers)
  }
}
