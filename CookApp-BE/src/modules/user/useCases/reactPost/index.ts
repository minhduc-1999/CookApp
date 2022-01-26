import { Inject } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { User } from "domains/social/user.domain";
import { IPostService } from "modules/user/services/post.service";
import { ReactPostRequest } from "./reactPostRequest";
import { BaseCommand } from "base/cqrs/command.base";
import { ReactPostResponse } from "./reactPostResponse";
import { Reaction } from "domains/social/reaction.domain";
import { ReactPostEvent } from "modules/notification/usecases/ReactNotification";
import { Transaction } from "neo4j-driver";
import { IPostRepository } from "modules/user/interfaces/repositories/post.interface";
import { IReactionService } from "modules/user/services/reaction.service";
export class ReactPostCommand extends BaseCommand {
  reactReq: ReactPostRequest;
  constructor(
    tx: Transaction,
    user: User,
    reactReq: ReactPostRequest
  ) {
    super(tx, user);
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
    @Inject("IReactionService")
    private _reactionService: IReactionService,
    private _eventBus: EventBus
  ) { }
  async execute(command: ReactPostCommand): Promise<ReactPostResponse> {
    const { user, reactReq, tx } = command;
    const post = await this._postService.getPostDetail(reactReq.postId);

    const reactDto = new Reaction({
      type: reactReq.react,
      reactor: user,
      target: post
    });

    let reacted: boolean;

    const react = await this._postRepo.getReactionByUserId(
      user.id,
      reactReq.postId
    );
    if (react && react.type === reactReq.react) {
      await this._reactionService.unreact(reactDto, tx)
      reacted = false;
    } else {
      await this._reactionService.react(reactDto, tx)
      reacted = true;
    }

    if (reacted) {
      this._eventBus.publish(new ReactPostEvent(post, user));
    }
    return new ReactPostResponse(reacted);
  }
}
