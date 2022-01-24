import { Inject, InternalServerErrorException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { UserDTO } from "dtos/social/user.dto";
import { BaseCommand } from "base/cqrs/command.base";
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
import { PostDTO } from "dtos/social/post.dto";

export class CreateCommentCommand extends BaseCommand {
  commentReq: CreateCommentRequest;
  constructor(
    user: UserDTO,
    comment: CreateCommentRequest,
    tx: Transaction
  ) {
    super(tx, user);
    this.commentReq = comment;
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
    private _eventBus: EventBus,
    @Inject("IPostService")
    private _postService: IPostService
  ) { }
  async execute(command: CreateCommentCommand): Promise<CreateCommentResponse> {
    const { commentReq, user, tx } = command;
    const post = await this._postService.getPostDetail(commentReq.postId);
    const comment = new CommentDTO({
      content: commentReq.content,
      user,
      post: post
    })
    let createdComment: CommentDTO = null
    if (commentReq.parentId) {
      const parentComment = await this._commentService.getComment(commentReq.parentId)
      comment.parent = parentComment
      createdComment = await this._commentRepo
        .setTransaction(tx)
        .createReply(comment);
    } else {
      createdComment = await this._commentRepo
        .setTransaction(tx)
        .createComment(comment);
    }

    if(!createdComment) {
      throw new InternalServerErrorException() 
    }
    
    // this._eventBus.publish(new CommentPostEvent(post, user));
    return createdComment;
  }
}
