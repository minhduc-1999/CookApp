import { Inject } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { IPostRepository } from "modules/user/adapters/out/repositories/post.repository";
import { UserDTO } from "dtos/social/user.dto";
import { IPostService } from "modules/user/services/post.service";
import { ReactPostRequest } from "./reactPostRequest";
import { BaseCommand } from "base/cqrs/command.base";
import { ClientSession } from "mongoose";
import { IFeedRepository } from "modules/user/adapters/out/repositories/feed.repository";
import { ReactPostResponse } from "./reactPostResponse";
import { ReactionDTO } from "dtos/social/reaction.dto";
import { ReactPostEvent } from "modules/notification/usecases/ReactNotification";
export class ReactPostCommand extends BaseCommand {
  reactReq: ReactPostRequest;
  constructor(
    session: ClientSession,
    user: UserDTO,
    reactReq: ReactPostRequest
  ) {
    super(session, user);
    this.reactReq = reactReq;
  }
}

@CommandHandler(ReactPostCommand)
export class ReactPostCommandHandler
  implements ICommandHandler<ReactPostCommand>
{
  constructor(
    @Inject("IPostService")
    private _postService: IPostService,
    @Inject("IPostRepository")
    private _postRepo: IPostRepository,
    @Inject("IFeedRepository")
    private _feedRepo: IFeedRepository,
    private _eventBus: EventBus
  ) {}
  async execute(command: ReactPostCommand): Promise<ReactPostResponse> {
    const { user, reactReq } = command;
    const post = await this._postService.getPostDetail(reactReq.postId);

    const reactDto = ReactionDTO.create({
      type: reactReq.react,
      userId: user.id,
    });
    const tasks = [];
    let reacted: boolean;
    const react = await this._postRepo.getReactionByUserId(
      user.id,
      reactReq.postId
    );
    if (react && react.type === reactReq.react) {
      tasks.push(
        this._postRepo.deleteReact(user.id, reactReq.postId),
        this._feedRepo.updateNumReaction(reactReq.postId, -1)
      );
      reacted = false;
    } else {
      tasks.push(
        this._postRepo.reactPost(reactDto, reactReq.postId),
        this._feedRepo.updateNumReaction(reactReq.postId, 1)
      );
      reacted = true;
    }

    return await Promise.all(tasks).then(() => {
      if (reacted) {
        this._eventBus.publish(new ReactPostEvent(post, user));
      }
      return new ReactPostResponse(reacted);
    });
  }
}
