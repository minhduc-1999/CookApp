import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { PageOptionsDto } from "base/pageOptions.base";
import { UserDTO } from "dtos/user.dto";
import { IFeedRepository } from "modules/user/adapters/out/repositories/feed.repository";
import { ConfigService } from "nestjs-config";
import { GetFeedPostsResponse } from "./getFeedPostsResponse";
export class GetFeedPostsQuery extends BaseQuery {
  queryOptions: PageOptionsDto;
  constructor(user: UserDTO, queryOptions?: PageOptionsDto) {
    super(user);
    this.queryOptions = queryOptions;
  }
}

@QueryHandler(GetFeedPostsQuery)
export class GetFeedPostsQueryHandler
  implements IQueryHandler<GetFeedPostsQuery> {
  constructor(
    @Inject("IFeedRepository")
    private _feedRepo: IFeedRepository,
    private _configService: ConfigService
  ) {}
  async execute(query: GetFeedPostsQuery): Promise<GetFeedPostsResponse> {
    const { queryOptions, user } = query;
    const posts = await this._feedRepo.getPosts(user, queryOptions);
    posts.forEach((post) => {
      post.images = post.images?.map(
        (image) => this._configService.get("storage.publicUrl") + image
      );
    });
    const totalCount = await this._feedRepo.getTotalPosts(user);
    let meta: PageMetadata;
    if (posts.length > 0) {
      meta = new PageMetadata(
        queryOptions.offset,
        queryOptions.limit,
        totalCount
      );
    }
    return new GetFeedPostsResponse(posts, meta);
  }
}
