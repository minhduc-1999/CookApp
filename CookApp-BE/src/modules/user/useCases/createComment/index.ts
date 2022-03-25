import { BadRequestException, Inject, InternalServerErrorException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { User } from "domains/social/user.domain";
import { BaseCommand } from "base/cqrs/command.base";
import { CreateCommentRequest } from "./createCommentRequest";
import { CreateCommentResponse } from "./createCommentResponse";
import { Comment } from "domains/social/comment.domain";
import { ICommentService } from "modules/user/services/comment.service";
import { IPostService } from "modules/user/services/post.service";
import { ICommentRepository } from "modules/user/interfaces/repositories/comment.interface";
import { CommentPostEvent } from "modules/notification/events/CommentNotification";
import { RecipeStep } from "domains/core/recipeStep.domain";
import { ResponseDTO } from "base/dtos/response.dto";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { IInteractable } from "domains/interfaces/IInteractable.interface";
import { Post } from "domains/social/post.domain";

export class CreateCommentCommand extends BaseCommand {
  commentReq: CreateCommentRequest;
  constructor(
    user: User,
    request: CreateCommentRequest,
    tx: ITransaction
  ) {
    super(tx, user);
    this.commentReq = request;
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

    let target: IInteractable

    switch (commentReq.targetType) {
      case "POST":
        [target] = await this._postService.getPostDetail(commentReq.targetKeyOrID);
        this._eventBus.publish(new CommentPostEvent(target as Post, user));
        break;
      case "RECIPE_STEP":
        target = new RecipeStep({ id: commentReq.targetKeyOrID })
        break;
      default:
        throw new BadRequestException(ResponseDTO.fail("Target type not found"))
    }

    const parentComment = await this._commentService.getCommentBy(commentReq.replyFor)
    let comment = user.comment(target, commentReq.content, null, parentComment)
    let createdComment = await this._commentRepo
      .setTransaction(tx)
      .createComment(comment);

    if (!createdComment) {
      throw new InternalServerErrorException()
    }

    return new CreateCommentResponse(createdComment);
  }
}
