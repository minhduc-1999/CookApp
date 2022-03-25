import { BadRequestException, Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { ResponseDTO } from "base/dtos/response.dto";
import { RecipeStep } from "domains/core/recipeStep.domain";
import { Comment, CommentTarget } from "domains/social/comment.domain";
import { User } from "domains/social/user.domain";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { ICommentRepository } from "modules/user/interfaces/repositories/comment.interface";
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
    private _commentService: ICommentService
  ) { }
  async execute(query: GetCommentsQuery): Promise<GetCommentsResponse> {
    const { request } = query;

    let comments: Comment[] = []
    let totalCount: number = 0

    let target: CommentTarget;

    switch (request.targetType) {
      case "POST":
        target = (await this._postService.getPostDetail(request.targetKeyOrID))[0];
        break;
      case "RECIPE_STEP":
        // Check step's existence
        target = new RecipeStep({id: request.targetKeyOrID})
        break;
      default:
        throw new BadRequestException(ResponseDTO.fail("Target type not found"))
    }

    if (request.replyOf) {
      await this._commentService.getCommentBy(request.replyOf)
      comments = await this._commentRepo.getReplies(
        target,
        request.replyOf,
        request
      );
      totalCount = await this._commentRepo.getAmountOfReply(
        query.request.replyOf
      );
    } else {
      comments = await this._commentRepo.getComments(
        target,
        request
      );
      totalCount = await this._commentRepo.getAmountOfComment(
        target
      );
    }

    for (let comment of comments) {
      comment.numberOfReply = await this._commentRepo.getAmountOfReply(comment.id);
      if (comment.user.avatar) {
        comment.user.avatar = (
          await this._storageService.getDownloadUrls([comment.user.avatar])
        )[0];
      }
    }

    let meta: PageMetadata;
    if (comments.length > 0) {
      meta = new PageMetadata(
        request.offset,
        request.limit,
        totalCount
      );
    }
    return new GetCommentsResponse(comments, meta);
  }
}
