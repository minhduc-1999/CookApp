import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { PageOptionsDto } from "base/pageOptions.base";
import { IsOptional, IsUUID } from "class-validator";
import { Comment } from "domains/social/comment.domain";
import { User } from "domains/social/user.domain";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { ICommentRepository } from "modules/user/interfaces/repositories/comment.interface";
import { IPostService } from "modules/user/services/post.service";
import { isImageKey } from "utils";
import { GetCommentsRequest } from "./getCommentsRequest";
import { GetCommentsResponse } from "./getCommentsResponse";

export class CommentPageOption extends PageOptionsDto {
  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  parent: string;
}

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
  ) { }
  async execute(query: GetCommentsQuery): Promise<GetCommentsResponse> {
    const { request } = query;
    await this._postService.getPostDetail(request.targetKeyOrID);

    let comments: Comment[] = []
    let totalCount: number = 0

    if (request.parent) {
      comments = await this._commentRepo.getReplies(
        request.parent,
        request
      );
      totalCount = await this._commentRepo.getAmountOfReply(
        query.request.parent
      );
    } else {
      comments = await this._commentRepo.getPostComments(
        request.targetKeyOrID,
        request
      );
      totalCount = await this._commentRepo.getAmountOfComment(
        request.targetKeyOrID
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
        request.offset,
        request.limit,
        totalCount
      );
    }
    return new GetCommentsResponse(comments, meta);
  }
}
