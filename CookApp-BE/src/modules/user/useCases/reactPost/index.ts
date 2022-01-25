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
    private _eventBus: EventBus
  ) { }
  async execute(command: ReactPostCommand): Promise<ReactPostResponse> {
    const { user, reactReq, tx } = command;
    await this._postService.getPostDetail(reactReq.postId);

    const reactDto = new ReactionDTO({
      type: reactReq.react,
      userID: user.id,
    });
    const tasks = [];
    let reacted: boolean;
    const react = await this._postRepo.getReactionByUserId(
      user.id,
      reactReq.postId
    );
    if (react && react.type === reactReq.react) {
      tasks.push(
        this._postRepo.setTransaction(tx).deleteReact(user.id, reactReq.postId),
      );
      reacted = false;
    } else {
      tasks.push(
        this._postRepo.setTransaction(tx).reactPost(reactDto, reactReq.postId),
      );
      reacted = true;
    }

    return await Promise.all(tasks).then(() => {
      // if (reacted) {
      //   this._eventBus.publish(new ReactPostEvent(post, user));
      // }
      return new ReactPostResponse(reacted);
    });
  }
}
