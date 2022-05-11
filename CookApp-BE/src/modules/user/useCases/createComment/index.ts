import {
  BadRequestException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { User } from "domains/social/user.domain";
import { BaseCommand } from "base/cqrs/command.base";
import { CreateCommentRequest } from "./createCommentRequest";
import { CreateCommentResponse } from "./createCommentResponse";
import { ICommentService } from "modules/user/services/comment.service";
import { IPostService } from "modules/user/services/post.service";
import { CommentPostEvent } from "modules/notification/events/CommentNotification";
import { ResponseDTO } from "base/dtos/response.dto";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { IInteractable } from "domains/interfaces/IInteractable.interface";
import { Post } from "domains/social/post.domain";
import { InteractiveTargetType, MediaType } from "enums/social.enum";
import { IPostMediaRepository } from "modules/user/interfaces/repositories/postMedia.interface";
import { CommentMedia, Image } from "domains/social/media.domain";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { IFoodRecipeService } from "modules/core/services/recipeStep.service";
import { IAlbumMediaRepository } from "modules/user/interfaces/repositories/albumMedia.interface";
import { IAlbumService } from "modules/user/services/album.service";

export class CreateCommentCommand extends BaseCommand {
  commentReq: CreateCommentRequest;
  constructor(user: User, request: CreateCommentRequest, tx: ITransaction) {
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
    @Inject("IStorageService")
    private _storageService: IStorageService,
    @Inject("IFoodRecipeService")
    private _recipeService: IFoodRecipeService,
    @Inject("IAlbumMediaRepository")
    private _albumMediaRepo: IAlbumMediaRepository,
    @Inject("IPostService")
    private _postService: IPostService,
    @Inject("IAlbumService")
    private _albumService: IAlbumService
  ) {}
  async execute(command: CreateCommentCommand): Promise<CreateCommentResponse> {
    const { commentReq, user, tx } = command;

    if (commentReq.images?.length > 0) {
      commentReq.images = await this._storageService.makePublic(
        commentReq.images,
        MediaType.IMAGE,
        "comment"
      );
    }

    let target: IInteractable;

    switch (commentReq.targetType) {
      case InteractiveTargetType.POST:
        [target] = await this._postService.getPostDetail(commentReq.targetId);
        this._eventBus.publish(new CommentPostEvent(target as Post, user));
        break;
      case InteractiveTargetType.POST_MEDIA:
        target = await this._postMediaRepo.getMedia(commentReq.targetId);
        if (!target) {
          throw new NotFoundException(ResponseDTO.fail("Media not found"));
        }
        break;
      case InteractiveTargetType.RECIPE_STEP:
        target = await this._recipeService.getStepById(commentReq.targetId);
        break;
      case InteractiveTargetType.ALBUM_MEDIA:
        target = await this._albumMediaRepo.getMedia(commentReq.targetId);
        if (!target) {
          throw new NotFoundException(ResponseDTO.fail("Media not found"));
        }
        break;
      case InteractiveTargetType.ALBUM:
        target = await this._albumService.getAlbumDetail(commentReq.targetId);
        break;
      default:
        throw new BadRequestException(
          ResponseDTO.fail("Target type not valid")
        );
    }

    let medias: CommentMedia[];
    if (commentReq.images?.length > 0) {
      medias = commentReq.images?.map((image) => new Image({ key: image }));
    }

    const parentComment = await this._commentService.getCommentBy(
      commentReq.replyFor
    );
    let comment = user.comment(
      target,
      commentReq.content,
      medias,
      parentComment
    );
    let createdComment = await this._commentService.createComment(comment, tx);
    if (!createdComment) {
      throw new InternalServerErrorException();
    }

    return new CreateCommentResponse(createdComment);
  }
}
