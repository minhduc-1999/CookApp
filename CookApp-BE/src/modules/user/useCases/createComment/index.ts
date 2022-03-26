import { BadRequestException, Inject, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { User } from "domains/social/user.domain";
import { BaseCommand } from "base/cqrs/command.base";
import { CreateCommentRequest } from "./createCommentRequest";
import { CreateCommentResponse } from "./createCommentResponse";
import { ICommentService } from "modules/user/services/comment.service";
import { IPostService } from "modules/user/services/post.service";
import { CommentPostEvent } from "modules/notification/events/CommentNotification";
import { RecipeStep } from "domains/core/recipeStep.domain";
import { ResponseDTO } from "base/dtos/response.dto";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { IInteractable } from "domains/interfaces/IInteractable.interface";
import { Post } from "domains/social/post.domain";
import { InteractiveTargetType } from "enums/social.enum";
import { IPostMediaRepository } from "modules/user/interfaces/repositories/postMedia.interface";
import { CommentMedia, Image } from "domains/social/media.domain";

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
    @Inject("ICommentService")
    private _commentService: ICommentService,
    private _eventBus: EventBus,
    @Inject("IPostMediaRepository")
    private _postMediaRepo: IPostMediaRepository,
    @Inject("IPostService")
    private _postService: IPostService
  ) { }
  async execute(command: CreateCommentCommand): Promise<CreateCommentResponse> {
    const { commentReq, user, tx } = command;

    // if (req.images?.length > 0) {
    //   commentReq.images = await this._storageService.makePublic(
    //     req.images,
    //     MediaType.IMAGE
    //   );
    // }

    let target: IInteractable

    switch (commentReq.targetType) {
      case InteractiveTargetType.POST:
        [target] = await this._postService.getPostDetail(commentReq.targetId);
        this._eventBus.publish(new CommentPostEvent(target as Post, user));
        break;
      case InteractiveTargetType.POST_MEDIA:
        target = await this._postMediaRepo.getMedia(commentReq.targetId)
        if (!target) {
          throw new NotFoundException(
            ResponseDTO.fail("Media not found")
          );
        }
        break;
      case InteractiveTargetType.RECIPE_STEP:
        target = new RecipeStep({ id: commentReq.targetId })
        break;
      default:
        throw new BadRequestException(ResponseDTO.fail("Target type not valid"))
    }
    let medias: CommentMedia[]
    if (commentReq.images?.length > 0) {
      medias = [new Image({ key: commentReq.images })]
    }

    const parentComment = await this._commentService.getCommentBy(commentReq.replyFor)
    let comment = user.comment(target, commentReq.content, medias, parentComment)
    let createdComment = await this._commentService.createComment(comment, tx)
    if (!createdComment) {
      throw new InternalServerErrorException()
    }

    return new CreateCommentResponse(createdComment);
  }
}
