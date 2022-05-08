import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PostCreatedEvent } from "domains/social/events/post.event";
import { IUserSeService } from "modules/auth/adapters/out/services/userSe.service";
import { IFeedRepository } from "modules/user/interfaces/repositories/feed.interface";
import { IFollowRepository } from "modules/user/interfaces/repositories/follow.interface";
import * as lodash from "lodash";
import { User } from "domains/social/user.domain";

@EventsHandler(PostCreatedEvent)
export class PropagatePostCreatedEventHandler
  implements IEventHandler<PostCreatedEvent>
{
  constructor(
    @Inject("IFeedRepository")
    private _feedRepository: IFeedRepository,
    @Inject("IFollowRepository")
    private _followRepo: IFollowRepository,
    @Inject("IUserSeService")
    private _userSeService: IUserSeService
  ) {}

  async handle(event: PostCreatedEvent): Promise<void> {
    const { post, author } = event;
    const [followers, _] = await this._followRepo.getFollowers(event.author.id);
    const relatedUser = (
      await this._userSeService.findManyByInterestsTopic(post.tags)
    ).map((id) => new User({ id }));
    const receiver = lodash.uniqBy(
      [...followers, ...relatedUser, author],
      "id"
    );

    console.log("follower", followers.map(f => f.id))
    console.log("interest", relatedUser)
    console.log("follower", receiver.map(f => f.id))

    this._feedRepository.pushNewPost(post, receiver);
  }
}
