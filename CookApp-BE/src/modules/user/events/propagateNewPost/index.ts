import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PostCreatedEvent } from "domains/social/events/post.event";
import { IUserSeService } from "modules/auth/adapters/out/services/userSe.service";
import { IFeedRepository } from "modules/user/interfaces/repositories/feed.interface";
import { IFollowRepository } from "modules/user/interfaces/repositories/follow.interface";

@EventsHandler(PostCreatedEvent)
export class PropagatePostCreatedEventHandler implements IEventHandler<PostCreatedEvent> {
  constructor(
    @Inject("IFeedRepository")
    private _feedRepository: IFeedRepository,
    @Inject("IFollowRepository")
    private _followRepo: IFollowRepository,
    @Inject("IUserSeService")
    private _userSeService: IUserSeService
  ) { }

  async handle(event: PostCreatedEvent): Promise<void> {
    const [followers, _] = await this._followRepo.getFollowers(event.author.id);
    followers.push(event.author)
    await this._feedRepository.pushNewPost(event.post, followers)
  }
}
