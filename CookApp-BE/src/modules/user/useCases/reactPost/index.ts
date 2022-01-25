import { Inject } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { UserDTO } from "dtos/social/user.dto";
import { IPostService } from "modules/user/services/post.service";
import { ReactPostRequest } from "./reactPostRequest";
import { BaseCommand } from "base/cqrs/command.base";
import { ReactPostResponse } from "./reactPostResponse";
import { ReactionDTO } from "dtos/social/reaction.dto";
import { ReactPostEvent } from "modules/notification/usecases/ReactNotification";
import { Transaction } from "neo4j-driver";
import { IPostRepository } from "modules/user/interfaces/repositories/post.interface";
import { IReactionService } from "modules/user/services/reaction.service";
export class ReactPostCommand extends BaseCommand {
  reactReq: ReactPostRequest;
  constructor(
    tx: Transaction,
    user: UserDTO,
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

    const reactDto = new ReactionDTO({
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
