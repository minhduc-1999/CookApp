import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { PageOptionsDto } from "base/pageOptions.base";
import { UserDTO } from "dtos/user.dto";
import { floor } from "lodash";
import { IWallRepository } from "modules/user/adapters/out/repositories/wall.repository";
import { GetWallPostsResponse } from "./getWallPostsResponse";
export class GetWallPostsQuery extends BaseQuery {
  queryOptions: PageOptionsDto;
  constructor(user: UserDTO, queryOptions?: PageOptionsDto) {
    super(user);
    this.queryOptions = queryOptions;
  }
}

@QueryHandler(GetWallPostsQuery)
export class GetWallPostsQueryHandler
  implements IQueryHandler<GetWallPostsQuery> {
  constructor(
    @Inject("IWallRepository")
    private _wallRepo: IWallRepository
  ) {}
  async execute(query: GetWallPostsQuery): Promise<GetWallPostsResponse> {
    const { queryOptions, user } = query;
    const posts = await this._wallRepo.getPosts(user, queryOptions);
    const totalCount = await this._wallRepo.getTotalPosts(user);
    let meta = new PageMetadata({
      page: queryOptions.offset + 1,
      totalCount,
      pageSize: queryOptions.limit,
      totalPage: floor(totalCount / queryOptions.limit + 1),
    });
    return new GetWallPostsResponse(posts, meta);
  }
}
