import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { User } from "domains/social/user.domain";
import { IWallRepository } from "modules/user/interfaces/repositories/wall.interface";
import { IPostService } from "modules/user/services/post.service";
import { GetWallPostsRequest } from "./getWallPostsRequest";
import { GetWallPostsResponse } from "./getWallPostsResponse";
export class GetWallPostsQuery extends BaseQuery {
  queryReq: GetWallPostsRequest;
  targetId: string;
  constructor(user: User, targetId: string, queryOptions?: GetWallPostsRequest) {
    super(user);
    this.queryReq = queryOptions;
    this.targetId = targetId;
  }
}

@QueryHandler(GetWallPostsQuery)
export class GetWallPostsQueryHandler
  implements IQueryHandler<GetWallPostsQuery>
{
  constructor(
    @Inject("IWallRepository")
    private _wallRepo: IWallRepository,
    @Inject("IPostService")
    private _postService: IPostService
  ) { }
  async execute(query: GetWallPostsQuery): Promise<GetWallPostsResponse> {
    const { queryReq, targetId } = query;
    let [posts, total] = await this._wallRepo.getPosts(targetId, queryReq);
    posts = await this._postService.fulfillUrls(posts)
    let meta: PageMetadata;
    if (posts.length > 0) {
      meta = new PageMetadata(
        queryReq.offset,
        queryReq.limit,
        total
      );
    }
    return new GetWallPostsResponse(posts, meta);
  }
}
