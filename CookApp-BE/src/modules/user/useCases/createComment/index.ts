import { Inject } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { UserDTO } from "dtos/social/user.dto";
import { BaseCommand } from "base/cqrs/command.base";
import { ClientSession } from "mongoose";
import { ICommentRepository } from "modules/user/adapters/out/repositories/comment.repository";
import { CreateCommentRequest } from "./createCommentRequest";
import { CreateCommentResponse } from "./createCommentResponse";
import { CommentDTO } from "dtos/social/comment.dto";
import { ICommentService } from "modules/user/services/comment.service";
import { IPostRepository } from "modules/user/adapters/out/repositories/post.repository";
import { IFeedRepository } from "modules/user/adapters/out/repositories/feed.repository";
import { CommentPostEvent } from "modules/notification/usecases/CommentNotification";
import { IPostService } from "modules/user/services/post.service";
import { Transaction } from "neo4j-driver";

export class CreateCommentCommand extends BaseCommand {
  commentDto: CreateCommentRequest;
  constructor(
    user: UserDTO,
    comment: CreateCommentRequest,
    tx: Transaction
  ) {
    super(tx, user);
    this.commentDto = comment;
  }
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentCommandHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    @Inject("ICommentRepository")
    private _commentRepo: ICommentRepository,
    @Inject("ICommentService")
    private _commentService: ICommentService,
    @Inject("IPostRepository")
    private _postRepo: IPostRepository,
    @Inject("IFeedRepository")
    private _feedRepo: IFeedRepository,
    private _eventBus: EventBus,
    @Inject("IPostService")
    private _postService: IPostService
  ) { }
  async execute(command: CreateCommentCommand): Promise<CreateCommentResponse> {
    const { commentDto, user, tx } = command;
    const post = await this._postService.getPostDetail(commentDto.postId);
    const parentComment = commentDto.parentId
      ? await this._commentService.getComment(commentDto.parentId)
      : commentDto.postId;
    const comment = new CommentDTO({
      ...commentDto,
      user,
    }).setParent(parentComment);
    const createdComment = await this._commentRepo
      .setTransaction(tx)
      .createComment(comment);
    return await Promise.all([
      this._feedRepo.updateNumComment(commentDto.postId, 1),
      this._postRepo.updateNumComment(commentDto.postId, 1),
    ]).then(() => {
      this._eventBus.publish(new CommentPostEvent(post, user));
      return createdComment;
    });
  }
}
