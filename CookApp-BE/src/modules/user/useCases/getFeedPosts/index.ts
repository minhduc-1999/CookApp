import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { PageOptionsDto } from "base/pageOptions.base";
import { FoodShare } from "domains/social/post.domain";
import { User } from "domains/social/user.domain";
import { PostType } from "enums/social.enum";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { IFeedRepository } from "modules/user/interfaces/repositories/feed.interface";
import { IReactionRepository } from "modules/user/interfaces/repositories/reaction.interface";
import { ISavedPostRepository } from "modules/user/interfaces/repositories/savedPost.interface";
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
    @Inject("ISavedPostRepository")
    private _savedRepo: ISavedPostRepository
  ) {}
  async execute(query: GetFeedPostsQuery): Promise<GetFeedPostsResponse> {
    const { queryOptions, user } = query;
    const [posts, total] = await this._feedRepo.getPosts(user, queryOptions);

    for (let post of posts) {
      post.medias = await this._storageService.getDownloadUrls(post.medias);
      if (post.author?.avatar) {
        post.author.avatar = (
          await this._storageService.getDownloadUrls([post.author.avatar])
        )[0];
      }
      switch (post.type) {
        case PostType.FOOD_SHARE:
          post = post as FoodShare;
          if ((<FoodShare>post).ref) {
            (<FoodShare>post).ref.photos =
              await this._storageService.getDownloadUrls(
                (<FoodShare>post).ref.photos
              );
          }
          break;
        case PostType.MOMENT:
          break;
        default:
          break;
      }
    }

    let meta: PageMetadata;
    if (posts.length > 0) {
      meta = new PageMetadata(queryOptions.offset, queryOptions.limit, total);
    }

    const postsRes = await Promise.all(
      posts.map(async (post) => {
        const reaction = await this._reactionRepo.findById(user.id, post.id);
        const saved = await this._savedRepo.find(post.id, user.id);
        const temp = new GetPostResponse(post, reaction, saved ? true : false);
        return temp;
      })
    );
    return new GetFeedPostsResponse(postsRes, meta);
  }
}
