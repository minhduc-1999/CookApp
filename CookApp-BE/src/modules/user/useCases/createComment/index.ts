import { Inject, InternalServerErrorException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { User } from "domains/social/user.domain";
import { BaseCommand } from "base/cqrs/command.base";
import { CreateCommentRequest } from "./createCommentRequest";
import { CreateCommentResponse } from "./createCommentResponse";
import { Comment } from "domains/social/comment.domain";
import { ICommentService } from "modules/user/services/comment.service";
import { IPostService } from "modules/user/services/post.service";
import { Transaction } from "neo4j-driver";
import { ICommentRepository } from "modules/user/interfaces/repositories/comment.interface";

export class CreateCommentCommand extends BaseCommand {
  commentReq: CreateCommentRequest;
  constructor(
    user: User,
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
    const comment = new Comment({
      content: commentReq.content,
      user,
      target: post
    })
    let createdComment: Comment = null
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
