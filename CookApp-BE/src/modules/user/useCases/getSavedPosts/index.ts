import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { PageOptionsDto } from "base/pageOptions.base";
import { User } from "domains/social/user.domain";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { IReactionRepository } from "modules/user/interfaces/repositories/reaction.interface";
import { ISavedPostRepository } from "modules/user/interfaces/repositories/savedPost.interface";
import { SavedPostDTO, GetSavedPostsResponse } from "./getSavedPostsResponse";
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
    @Inject("IReactionRepository")
    private _reactionRepo: IReactionRepository,
    @Inject("ISavedPostRepository")
    private _savedPostRepo: ISavedPostRepository,
  ) { }
  async execute(query: GetSavedPostsQuery): Promise<GetSavedPostsResponse> {
    const { queryOptions, user } = query;
    const [posts, total] = await this._savedPostRepo.getSavedPosts(user, queryOptions);

    for (let item of posts) {
      const { post } = item
      post.images = await this._storageService.getDownloadUrls(post.images);
      if (post.author?.avatar) {
        post.author.avatar = (
          await this._storageService.getDownloadUrls([post.author.avatar])
        )[0];
      }
    }

    let meta: PageMetadata;
    if (posts.length > 0) {
      meta = new PageMetadata(
        queryOptions.offset,
        queryOptions.limit,
        total
      );
    }

    const postsRes = await Promise.all(
      posts.map(async (item) => {
        const temp = new SavedPostDTO(item);
        const reaction = await this._reactionRepo.findById(
          user.id,
          item.post.id
        );
        if (reaction) {
          temp.post.reaction = reaction.type;
        }
        return temp;
      })
    );
    return new GetSavedPostsResponse(postsRes, meta);
  }
}
