import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IPostRepository } from "modules/user/adapters/out/repositories/post.repository";
import { UserDTO } from "dtos/user.dto";
import { IPostService } from "modules/user/services/post.service";
import { ReactPostRequest } from "./reactPostRequest";
import { BaseCommand } from "base/cqrs/command.base";
import { ClientSession } from "mongoose";
import { IWallRepository } from "modules/user/adapters/out/repositories/wall.repository";
import { IFeedRepository } from "modules/user/adapters/out/repositories/feed.repository";
import { ReactPostResponse } from "./reactPostResponse";
import { ReactionDTO } from "dtos/reaction.dto";
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
  implements ICommandHandler<ReactPostCommand> {
  constructor(
    @Inject("IPostService")
    private _postService: IPostService,
    @Inject("IPostRepository")
    private _postRepo: IPostRepository,
    @Inject("IWallRepository")
    private _wallRepo: IWallRepository,
    @Inject("IFeedRepository")
    private _feedRepo: IFeedRepository
  ) {}
  async execute(command: ReactPostCommand): Promise<ReactPostResponse> {
    const { user, reactReq } = command;
    await this._postService.getPostDetail(reactReq.postId);

    const reactDto = ReactionDTO.create({
      type: reactReq.react,
      userId: user.id,
    });
    let reacted: boolean;
    const react = await this._postRepo.getReactionByUserId(
      user.id,
      reactReq.postId
    );
    if (react) {
      reacted = !(await this._postRepo.deleteReact(user.id, reactReq.postId));
    } else {
      reacted = await this._postRepo.reactPost(reactDto, reactReq.postId);
    }

    return new ReactPostResponse(reacted);
  }
}
