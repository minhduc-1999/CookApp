import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { PageOptionsDto } from "base/pageOptions.base";
import { User } from "domains/social/user.domain";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { IPostRepository } from "modules/user/interfaces/repositories/post.interface";
import { isImageKey } from "utils";
import { GetPostResponse } from "../getPostById/getPostResponse";
import { GetSavedPostsResponse } from "./getSavedPostsResponse";
export class GetSavedPostsQuery extends BaseQuery {
  queryOptions: PageOptionsDto;
  constructor(user: User, queryOptions?: PageOptionsDto) {
    super(user);
    this.queryOptions = queryOptions;
  }
}

@QueryHandler(GetSavedPostsQuery)
export class GetSavedPostsQueryHandler
  implements IQueryHandler<GetSavedPostsQuery>
{
  constructor(
    @Inject("IStorageService") private _storageService: IStorageService,
    @Inject("IPostRepository")
    private _postRepo: IPostRepository,
  ) {}
  async execute(query: GetSavedPostsQuery): Promise<GetSavedPostsResponse> {
    const { queryOptions, user } = query;
    const posts = await this._postRepo.getSavedPosts(user, queryOptions);

    for (let post of posts) {
      post.images = await this._storageService.getDownloadUrls(post.images);
      if (post.author?.avatar && isImageKey(post.author?.avatar)) {
        post.author.avatar = (
          await this._storageService.getDownloadUrls([post.author.avatar])
        )[0];
      }
    }

    const totalCount = await this._postRepo.getTotalSavedPost(user)
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
        const reaction = await this._postRepo.getReactionByUserId(
          user.id,
          post.id
        );
        if (reaction) {
          temp.reaction = reaction.type;
        }
        return temp;
      })
    );
    return new GetSavedPostsResponse(postsRes, meta);
  }
}
