import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { PageOptionsDto } from "base/pageOptions.base";
import { UserDTO } from "dtos/social/user.dto";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { IFeedRepository } from "modules/user/adapters/out/repositories/feed.repository";
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
    @Inject("IStorageService") private _storageService: IStorageService
  ) {}
  async execute(query: GetFeedPostsQuery): Promise<GetFeedPostsResponse> {
    const { queryOptions, user } = query;
    const posts = await this._feedRepo.getPosts(user, queryOptions);
    for (let post of posts) {
      post.images = await this._storageService.getDownloadUrls(post.images);
      if (post.author?.avatar?.length > 0) {
        post.author.avatar = (
          await this._storageService.getDownloadUrls([post.author.avatar])
        )[0];
      }
    }
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
