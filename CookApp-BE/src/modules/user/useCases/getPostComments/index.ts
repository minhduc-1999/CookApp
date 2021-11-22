import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { PageOptionsDto } from "base/pageOptions.base";
import { IsMongoId, IsOptional } from "class-validator";
import { UserDTO } from "dtos/user.dto";
import { ICommentRepository } from "modules/user/adapters/out/repositories/comment.repository";
import { IPostService } from "modules/user/services/post.service";
import { GetPostCommentsResponse } from "./getPostCommentsResponse";

export class CommentPageOption extends PageOptionsDto {
  @IsMongoId()
  @IsOptional()
  @ApiPropertyOptional({type: String})
  parent: string
}

export class GetPostCommentsQuery extends BaseQuery {
  queryOptions: CommentPageOption;
  postId: string;
  constructor(user: UserDTO, postId: string, queryOptions?: CommentPageOption) {
    super(user);
    this.queryOptions = queryOptions;
    this.postId = postId;
  }
}

@QueryHandler(GetPostCommentsQuery)
export class GetPostCommentsQueryHandler
  implements IQueryHandler<GetPostCommentsQuery> {
  constructor(
    @Inject("ICommentRepository")
    private _commentRepo: ICommentRepository,
    @Inject("IPostService")
    private _postService: IPostService
  ) {}
  async execute(query: GetPostCommentsQuery): Promise<GetPostCommentsResponse> {
    const { queryOptions, user, postId } = query;
    await this._postService.getPostDetail(postId);
    const comments = await this._commentRepo.getPostComments(
      postId,
      queryOptions
    );
    // const totalCount = await this._commentRepo.getTotalPosts(user);
    let meta: PageMetadata;
    // if (comments.length > 0) {
    //   meta = new PageMetadata(
    //     queryOptions.offset,
    //     queryOptions.limit,
    //     totalCount
    //   );
    // }
    return new GetPostCommentsResponse(comments, meta);
  }
}
