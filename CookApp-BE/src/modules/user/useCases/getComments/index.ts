import { BadRequestException, Inject, NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { ResponseDTO } from "base/dtos/response.dto";
import { IInteractable } from "domains/interfaces/IInteractable.interface";
import { Comment } from "domains/social/comment.domain";
import { User } from "domains/social/user.domain";
import { InteractiveTargetType } from "enums/social.enum";
import { IFoodRecipeService } from "modules/core/services/recipeStep.service";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { ICommentRepository } from "modules/user/interfaces/repositories/comment.interface";
import { IPostMediaRepository } from "modules/user/interfaces/repositories/postMedia.interface";
import { IAlbumService } from "modules/user/services/album.service";
import { ICommentService } from "modules/user/services/comment.service";
import { IPostService } from "modules/user/services/post.service";
import { GetCommentsRequest } from "./getCommentsRequest";
import { GetCommentsResponse } from "./getCommentsResponse";

export class GetCommentsQuery extends BaseQuery {
  request: GetCommentsRequest;
  constructor(user: User, request?: GetCommentsRequest) {
    super(user);
    this.request = request;
  }
}

@QueryHandler(GetCommentsQuery)
export class GetCommentsQueryHandler
  implements IQueryHandler<GetCommentsQuery>
{
  constructor(
    @Inject("ICommentRepository")
    private _commentRepo: ICommentRepository,
    @Inject("IPostService")
    private _postService: IPostService,
    @Inject("IStorageService") private _storageService: IStorageService,
    @Inject("ICommentService")
    private _commentService: ICommentService,
    @Inject("IPostMediaRepository")
    private _postMediaRepo: IPostMediaRepository,
    @Inject("IFoodRecipeService")
    private _recipeService: IFoodRecipeService,
    @Inject("IAlbumService")
    private _albumService: IAlbumService
  ) {}
  async execute(query: GetCommentsQuery): Promise<GetCommentsResponse> {
    const { request } = query;

    let comments: Comment[] = [];
    let totalCount: number = 0;

    let target: IInteractable;

    if (request.replyOf) {
      const parent = await this._commentService.getCommentBy(request.replyOf);
      [comments, totalCount] = await this._commentRepo.getReplies(
        parent,
        request
      );
    } else {
      switch (request.targetType) {
        case InteractiveTargetType.POST:
          [target] = await this._postService.getPostDetail(request.targetId);
          break;
        case InteractiveTargetType.RECIPE_STEP:
          target = await this._recipeService.getStepById(request.targetId);
          break;
        case InteractiveTargetType.POST_MEDIA:
          target = await this._postMediaRepo.getMedia(request.targetId);
          if (!target) {
            throw new NotFoundException(ResponseDTO.fail("Media not found"));
          }
          break;
        case InteractiveTargetType.ALBUM:
          target = await this._albumService.getAlbumDetail(request.targetId);
          break;
        default:
          throw new BadRequestException(
            ResponseDTO.fail("Target type not found")
          );
      }
      [comments, totalCount] = await this._commentRepo.getComments(
        target,
        request
      );
    }

    for (let comment of comments) {
      comment.nReplies = await this._commentRepo.countReply(comment.id);
      comment.medias = await this._storageService.getDownloadUrls(
        comment.medias
      );
      if (comment.user.avatar) {
        comment.user.avatar = (
          await this._storageService.getDownloadUrls([comment.user.avatar])
        )[0];
      }
    }

    let meta: PageMetadata;
    if (comments.length > 0) {
      meta = new PageMetadata(request.offset, request.limit, totalCount);
    }
    return new GetCommentsResponse(comments, meta);
  }
}
