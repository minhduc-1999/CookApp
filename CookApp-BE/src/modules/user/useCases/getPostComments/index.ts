import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { PageOptionsDto } from "base/pageOptions.base";
import { IsOptional, IsUUID } from "class-validator";
import { Comment } from "domains/social/comment.domain";
import { User } from "domains/social/user.domain";
import { IUserService } from "modules/auth/services/user.service";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { ICommentRepository } from "modules/user/interfaces/repositories/comment.interface";
import { IPostService } from "modules/user/services/post.service";
import { isImageKey } from "utils";
import { GetPostCommentsResponse } from "./getPostCommentsResponse";

export class CommentPageOption extends PageOptionsDto {
  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  parent: string;
}

export class GetPostCommentsQuery extends BaseQuery {
  queryOptions: CommentPageOption;
  postId: string;
  constructor(user: User, postId: string, queryOptions?: CommentPageOption) {
    super(user);
    this.queryOptions = queryOptions;
    this.postId = postId;
  }
}

@QueryHandler(GetPostCommentsQuery)
export class GetPostCommentsQueryHandler
  implements IQueryHandler<GetPostCommentsQuery>
{
  constructor(
    @Inject("ICommentRepository")
    private _commentRepo: ICommentRepository,
    @Inject("IPostService")
    private _postService: IPostService,
    @Inject("IStorageService") private _storageService: IStorageService,
    @Inject("IUserService") private _userService: IUserService
  ) { }
  async execute(query: GetPostCommentsQuery): Promise<GetPostCommentsResponse> {
    const { queryOptions, postId } = query;
    await this._postService.getPostDetail(postId);

    let comments: Comment[] = []
    let totalCount: number = 0

    if (queryOptions.parent) {
      comments = await this._commentRepo.getReplies(
        queryOptions.parent,
        queryOptions
      );
      totalCount = await this._commentRepo.getAmountOfReply(
        query.queryOptions.parent
      );
    } else {
      comments = await this._commentRepo.getPostComments(
        postId,
        queryOptions
      );
      totalCount = await this._commentRepo.getAmountOfComment(
        postId
      );
    }

    for (let comment of comments) {
      comment.numberOfReply = await this._commentRepo.getAmountOfReply(comment.id);
      if (comment.user.avatar && isImageKey(comment.user.avatar)) {
        comment.user.avatar = (
          await this._storageService.getDownloadUrls([comment.user.avatar])
        )[0];
      }
    }

    let meta: PageMetadata;
    if (comments.length > 0) {
      meta = new PageMetadata(
        queryOptions.offset,
        queryOptions.limit,
        totalCount
      );
    }
    return new GetPostCommentsResponse(comments, meta);
  }
}
