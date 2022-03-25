import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { PageOptionsDto } from "base/pageOptions.base";
import { User } from "domains/social/user.domain";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { IFeedRepository } from "modules/user/interfaces/repositories/feed.interface";
import { IReactionRepository } from "modules/user/interfaces/repositories/reaction.interface";
import { GetPostResponse } from "../getPostDetail/getPostResponse";
import { GetFeedPostsResponse } from "./getFeedPostsResponse";
export class GetFeedPostsQuery extends BaseQuery {
  queryOptions: PageOptionsDto;
  constructor(user: User, queryOptions?: PageOptionsDto) {
    super(user);
    this.queryOptions = queryOptions;
  }
}

@QueryHandler(GetFeedPostsQuery)
export class GetFeedPostsQueryHandler
  implements IQueryHandler<GetFeedPostsQuery>
{
  constructor(
    @Inject("IFeedRepository")
    private _feedRepo: IFeedRepository,
    @Inject("IStorageService") private _storageService: IStorageService,
    @Inject("IReactionRepository")
    private _reactionRepo: IReactionRepository,
  ) {}
  async execute(query: GetFeedPostsQuery): Promise<GetFeedPostsResponse> {
    const { queryOptions, user } = query;
    const posts = await this._feedRepo.getPosts(user, queryOptions);

    for (let post of posts) {
      post.images = await this._storageService.getDownloadUrls(post.images);
      if (post.author?.avatar && post.author?.avatar.isValidKey()) {
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

    const postsRes = await Promise.all(
      posts.map(async (post) => {
        const temp = new GetPostResponse(post);
        const reaction = await this._reactionRepo.findById(
          user.id,
          post.id
        );
        if (reaction) {
          temp.reaction = reaction.type;
        }
        return temp;
      })
    );
    return new GetFeedPostsResponse(postsRes, meta);
  }
}
